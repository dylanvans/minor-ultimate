
// When using async await, wrapping the function in this function will catch the errors
// So you don't have to handle errors for every function you write
exports.catchErrors = (fn) => {
	return function (req, res, next) {
		return fn(req, res, next).catch(next);
	}
}