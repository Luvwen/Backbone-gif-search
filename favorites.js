const Gif = Backbone.Model.extend({
    defaults: {
        imageUrl: '',
        title: 'Without title',
    },
});

const gifName = (resp) => {
    const options = {
        id: resp.id,
        title: resp.title,
        urlImage: resp?.images?.downsized?.url,
    };
    if (options.id != undefined) {
        const favsContainer = new FavsContainer(options);
    }
};

let gifId = '';
let count = 0;
const GifCollection = Backbone.Collection.extend({
    model: Gif,
    url: `https://api.giphy.com/v1/gifs/${gifId}?api_key=XQNUHZUpVVVfq34YnWCKCZzzrT2ID3ES&rating=g`,
    parse: function (response, options) {
        _.each(response, gifName);
    },
});

const gifCollection = new GifCollection();

let favGifsArr = [];
favGifsArr = JSON.parse(localStorage.getItem('favs'));
const FavsContainer = Backbone.View.extend({
    el: $('#gifs'),
    template: _.template($('#gif-template').html()),
    initialize: function (attributes) {
        this.loadGifs();
        this.options = attributes;
        if (this.options != undefined) {
            this.render();
        }
        $(this.el).unbind('click');
    },
    events: {
        'click .fav-button': 'toggleFavorites',
    },
    loadGifs: async function () {
        const idFromStorage = JSON.parse(localStorage.getItem('favs'));
        if (idFromStorage.length > count) {
            count = count + 1;
            idFromStorage.map((url) => {
                gifCollection.url = `https://api.giphy.com/v1/gifs/${
                    idFromStorage[count - 1]
                }?api_key=XQNUHZUpVVVfq34YnWCKCZzzrT2ID3ES&rating=g`;
            });
            await gifCollection.fetch();
        }
    },
    render: function () {
        const html = this.template(this.options);
        $('#gif-container-favs').append(html);
        return this;
    },
    toggleFavorites: function (e) {
        const gifId = e.target.id;
        if (favGifsArr.includes(gifId)) {
            this.removeFavorites(gifId);
        } else {
            this.addFavorites(gifId);
        }
    },
    removeFavorites: (gifId) => {
        favGifsArr = favGifsArr.filter((id) => id !== gifId);
        localStorage.setItem('favs', JSON.stringify(favGifsArr));
        window.location.href = 'http://127.0.0.1:5500/favorites.html';
    },
    addFavorites: (gifId) => {
        favGifsArr.push(gifId);
        localStorage.setItem('favs', JSON.stringify(favGifsArr));
    },
});

const favsContainer = new FavsContainer();

const FavsView = Backbone.View.extend({
    initialize: function () {
        this.render();
    },
    render: async function () {
        return this;
    },
});

console.log('hola mundo');
