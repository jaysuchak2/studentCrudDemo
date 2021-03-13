module.exports = function (mongoose) {
    var options = {
        collection: 'students',
        timestamps: true
    };
    var student = new mongoose.Schema({
        firstName: {
            type: String
        },
        fatherName:{
            type: String
        },
        motherName: {
            type: String,
        },
        gender: {
            type: String,
        },
        address: {
            type: String
        },
        phone: {
            type: String,
        },
        profilePhoto: {
            type: String
        },
    }, options);
    return student;
};