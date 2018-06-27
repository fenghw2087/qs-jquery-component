const hasChinese = (str) => {
    return /[\u2E80-\u9FFF]/i.test(str);
};

export default hasChinese