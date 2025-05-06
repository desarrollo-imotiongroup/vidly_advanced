// const winston = require('winston');
// require('winston-mongodb');

// module.exports = function () {
//     winston.exceptions.handle(
//         new winston.transports.File({ filename: 'logs/errors/exceptions.log' })
//     );

//     winston.rejections.handle(
//         new winston.transports.File({ filename: 'logs/errors/rejections.log' })
//     );

//     winston.add(new winston.transports.File({ filename: 'logs/logfile.log' }));

//     winston.add(new winston.transports.Console({
//         level: 'info', // This controls the minimum level (info, warn, error, etc.)
//         format: winston.format.combine(
//             winston.format.colorize(),
//             winston.format.simple()
//         )
//     }));
    
//     winston.add(new winston.transports.MongoDB({
//         db: process.env.MONGO_URI,
//         level: 'info'
//     }));

// }


///// For deployment (render)

const winston = require('winston');

module.exports = function () {
    winston.exceptions.handle(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    );

    winston.rejections.handle(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    );

    winston.add(new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    })
);
}