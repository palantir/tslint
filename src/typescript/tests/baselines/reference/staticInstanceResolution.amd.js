var Comment = (function () {
    function Comment() {
    }
    Comment.prototype.getDocCommentText = function () {
    };

    Comment.getDocCommentText = function (comments) {
        comments[0].getDocCommentText();
        var c;
        c.getDocCommentText();
    };
    return Comment;
})();
