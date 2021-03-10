var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();


const getVideoInfo = (inputPath) => {
    return new Promise((resolve, reject) => {
        return ffmpeg.ffprobe(inputPath, (error, videoInfo) => {
            if (error) {
                return reject(error);
            }

            const { duration, size } = videoInfo.format;

            return resolve({
                size,
                durationInSeconds: Math.floor(duration),
            });
        });
    });
};

const createFragmentPreview = async (
    inputPath,
    outputPath,
    fragmentDurationInSeconds = 4,
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { durationInSeconds: videoDurationInSeconds } = await getVideoInfo(
                inputPath,
            );

            const startTimeInSeconds = getStartTimeInSeconds(
                videoDurationInSeconds,
                fragmentDurationInSeconds,
            );

            return ffmpeg()
                .input(inputPath)
                .inputOptions([`-ss ${startTimeInSeconds}`])
                .outputOptions([`-t ${fragmentDurationInSeconds}`])
                .noAudio()
                .output(outputPath)
                .on('end', resolve)
                .on('error', reject)
                .run();
        }
        catch (e) {
            console.log(e)
        }
    });
};

const getStartTimeInSeconds = (
    videoDurationInSeconds,
    fragmentDurationInSeconds,
) => {
    // by subtracting the fragment duration we can be sure that the resulting
    // start time + fragment duration will be less than the video duration
    const safeVideoDurationInSeconds =
        videoDurationInSeconds - fragmentDurationInSeconds;

    // if the fragment duration is longer than the video duration
    if (safeVideoDurationInSeconds <= 0) {
        return 0;
    }

    return getRandomIntegerInRange(
        0.25 * safeVideoDurationInSeconds,
        0.75 * safeVideoDurationInSeconds,
    );
};

const getRandomIntegerInRange = (min, max) => {
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);

    return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
};


const getImages = (inputPath, outputPattern, numberOfFrames) => {
    try {
        return new Promise(async (resolve, reject) => {
            const { durationInSeconds } = await getVideoInfo(inputPath);

            // 1/frameIntervalInSeconds = 1 frame each x seconds
            const frameIntervalInSeconds = Math.floor(
                durationInSeconds / numberOfFrames,
            );

            return ffmpeg()
                .input(inputPath)
                .outputOptions([`-vf fps=1/${frameIntervalInSeconds}`])
                .output(outputPattern)
                .on('end', resolve)
                .on('error', reject)
                .run();
        });
    } catch (e) {
        console.log(e);
    }
}

const createXFramesPreview = async (
    inputPath,
    outputPath,
    numberOfFrames,
    outPutPathPattan
) => {
    return new Promise(async (resolve, reject) => {
        await getImages(inputPath, outPutPathPattan, numberOfFrames);

        try {
            ffmpeg()
                .input(inputPath)
                .outputOptions([`-filter_complex "[0:v] split [a][b];[a] palettegen [p];[b][p] paletteuse"`])
                .output(outputGifPath)
                .on('end', resolve)
                .on('error', reject)
                .run();
        } catch (e) {
            console.log(e);
        }
    });
};


module.exports = { createFragmentPreview, createXFramesPreview }