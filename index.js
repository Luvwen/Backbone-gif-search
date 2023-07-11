const Gif = Backbone.Model.extend({
    default: {
        imageUrl: '',
        title: 'Without title',
    },
});

let searchParam = '';

const gifName = (res) => {
    let count = 0;
    const singleGif = new SingleGif({
        urlImage: res.images.downsized.url,
        title: res.title,
        id: res.id,
    });
    const gifView = new GifView(singleGif);
    if (count === 0) {
        count = count + 1;
        $('#gif-container').prepend(
            $('#search-word')
                .text($('#input-search').val())
                .removeClass('search-word')
                .addClass('open')
        );
    }
};

const GifCollection = Backbone.Collection.extend({
    model: Gif,
    url: `https://api.giphy.com/v1/gifs/search?api_key=XQNUHZUpVVVfq34YnWCKCZzzrT2ID3ES&q=${searchParam}&limit=25&offset=0&rating=g&lang=en`,
    parse: function (response, options) {
        _.each(response.data, gifName);
    },
});

const gifCollection = new GifCollection();

let favGifsArr = [];

const SingleGif = Backbone.View.extend({
    el: $('#gif-container'),
    template: _.template($('#gif-template').html()),
    initialize: function (attributes) {
        this.options = attributes;
        this.favorite = $('.fav-button');
        // TODO: Do a better search of why this 🔽 solves the problem of multiple events call
        // This line unbinds the click event from the el wrapper of the view aka #gif-container.
        $(this.el).unbind('click');
        if (this.options != undefined) {
            this.render();
        }
    },
    events: {
        'click .fav-button': 'toggleFavorites',
    },
    render: function () {
        if (this.options != undefined) {
            const datos = {
                urlImage: this.options.urlImage,
                title: this.options.title,
                id: this.options.id,
            };
            const html = this.template(datos);
            $('#gifs').append(html);
            return this;
        }
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
    },
    addFavorites: (gifId) => {
        favGifsArr.push(gifId);
        localStorage.setItem('favs', JSON.stringify(favGifsArr));
    },
});

const singleGif = new SingleGif();

const GifView = Backbone.View.extend({
    el: $('#gif-app'),
    template: _.template($('#gif-template').html()),
    initialize: function (attributes) {
        this.options = attributes;
        this.input = $('#input-search');
        if (this.el != undefined) {
            this.render();
        }
    },
    events: {
        'keyup #input-search': 'inputChange',
    },
    inputChange: async function (e) {
        if (e.which != 13) return;
        searchParam = this.input.val();
        await this.fetchGifs(searchParam);
        this.input.val('');
    },
    render: function () {
        return this;
    },
    fetchGifs: async (searchParam) => {
        gifCollection.url = `https://api.giphy.com/v1/gifs/search?api_key=XQNUHZUpVVVfq34YnWCKCZzzrT2ID3ES&q=${searchParam}&limit=25&offset=0&rating=g&lang=en`;
        $('#gifs').empty();
        await gifCollection.fetch();
    },
});

const gifView = new GifView();
