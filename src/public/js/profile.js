/*
export const logout = async (req, res) => {
    try {
        // Destruir sesión
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        res.status(500).send({
            error: error.message
        });
    }
};
*/