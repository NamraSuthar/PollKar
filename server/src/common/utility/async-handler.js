export function asyncHandler(fn) {
    return function wrappedAsyncFunction(req, res, next) {
        Promise.resolve(fn(req, res, next).catch(next));
    }
}