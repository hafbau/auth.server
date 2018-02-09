module.exports = (ctx) => {
    const { request: { body: { fields } } } = ctx;
    let data = fields ? fields : ctx.request.body;
    // this due to non-form data
    if (typeof data === 'string') data = JSON.parse(data);
    console.log('data in get req data', data)
    let {
        createdAt,
        email,
        hash,
        lastActive,
        loggedIn,
        password,
        updatedAt,
        __meta_
    } = data;

    delete data.createdAt;
    delete data.email;
    delete data.hash;
    delete data.lastActive;
    delete data.loggedIn;
    delete data.updatedAt;
    delete data.__v;
    delete data.__meta_;

    __meta_ = Object.assign({}, __meta_, data);
    return { email, password, __meta_ };
}