exports.randomString = (size) => {

    const liste = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];
    let result = '';
    for (let i = 0; i < size; i = i++) {
        result += liste[Math.floor(Math.random() * liste.length)];
    }
    return result;

};

// http://stackoverflow.com/a/29951992
exports.isSubsetInArray = (source, target) => {

    return !_.difference(_.flatten(source), _.flatten(target)).length;

};

exports.isValidObjectID = (str) => {

    // coerce to string so the function can be generically used to test both strings and native objectIds created by the driver
    str = str + '';
    const len = str.length;
    let valid = false;

    if (len === 12 || len === 24) {
        valid = /^[0-9a-fA-F]+$/.test(str);
    }
    return valid;

};
