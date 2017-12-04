module.exports = (ctx) => {
    const { request: { body: { fields } } } = ctx;
    let data = fields ? fields : ctx.request.body;
    // this due to non-form data
    if (typeof data === 'string') data = JSON.parse(data);

    let {
        email,
        password,
        loggedIn,
        lastActive,
        createdAt,
        updatedAt,
        __meta_
    } = data;

    delete email;
    delete password;
    delete loggedIn;
    delete lastActive;
    delete createdAt;
    delete updatedAt;
    delete __meta_;

    __meta_ = Object.assign({}, __meta_, data);
    return { email, password, __meta_ };
}