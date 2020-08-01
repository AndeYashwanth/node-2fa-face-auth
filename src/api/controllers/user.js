export default (User) => {
    return {
        redirectToOwnUsername: function (req, res) {
            res.send("redirect!");
        },
        getDashboardPage: function (req, res) {
            res.send('dashboard');
        },
        getUserDetails: function (req, res) {
            res.send('dashboard');
        }
    }
}