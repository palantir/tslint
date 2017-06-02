declare var winston: any;

const DefaultOptions = {
    transports: [
    new winston.transports.Console({
        json: true,
        colorize: true,
        stringify: true,
    })],
    rewriters: [
        (level, message, meta) => {
            if (meta)
            {
                meta.timeStamp = new Date();
            }
            return meta;
        },
    ],

};

export const Logger = new winston.Logger(DefaultOptions);
