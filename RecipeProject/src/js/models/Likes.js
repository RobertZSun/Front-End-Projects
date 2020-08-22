 export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const likedDish = {
            id,
            title,
            author,
            img
        };
        this.likes.push(likedDish);

        // add to local storage
        this.addToLocalStorage();

        return likedDish;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(item => item.id === id)
        this.likes.splice(index, 1);

        // add to local storage
        this.addToLocalStorage();
    }

    isliked(id) {
        return this.likes.findIndex(item => item.id === id) !== -1;
    }

    getNumOfLikedDish() {
        return this.likes.length;
    }

    addToLocalStorage() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    getLocalStorage() {
        const data = JSON.parse(localStorage.getItem('likes'));
        if (data) {
            this.likes = data;
        }
    }
}