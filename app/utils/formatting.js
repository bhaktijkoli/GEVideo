module.exports = {
    formatElapsed: (elapsed) => {
        let minutes = 0;
        while (elapsed > 59) {
            minutes++;
            elapsed -= 60;
        }

        if (minutes <= 9) minutes = `0${minutes}`;
        if (elapsed <= 9) elapsed = `0${elapsed}`;

        return `${minutes}:${elapsed}`;
    },
};
