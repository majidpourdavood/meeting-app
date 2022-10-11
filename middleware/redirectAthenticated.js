
module.exports = async (req, res, next) => {

    if (req.session.isLoggedIn) {

        try {
            res.status(200).redirect('/panel/dashboard');

        } catch (e) {
            res.status(500).json(e);
        }

    }else {
        next();
    }

}