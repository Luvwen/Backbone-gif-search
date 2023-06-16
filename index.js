const Gif = Backbone.Model.extend({
    default: {
        imageUrl: '',
        title: 'Without title'
    }
})

let searchParam = ''
    
const GifCollection = Backbone.Collection.extend({
    model: Gif,
    url: `https://api.giphy.com/v1/gifs/search?api_key=XQNUHZUpVVVfq34YnWCKCZzzrT2ID3ES&q=${searchParam}&limit=25&offset=0&rating=g&lang=en`
})

const gifCollection = new GifCollection()

// const SingleGif = Backbone.View.extend({
//     template: _.template($('#gif-template').html()),
//     initialize: function(){
//         this.render()
//     },
//     render: function(){
        
//     }
// })

// const singleGif = new SingleGif()

const SingleGif = Backbone.View.extend({
    template: _.template($('#gif-template').html()),
    initialize: function(){
        this.render()
    },
    render: function(){
        this.$el.html(this.template(this.model))
        return this
    }
})

const singleGif = new SingleGif()

const GifView = Backbone.View.extend({
    el: $('#gif-app'),
    template: _.template($('#gif-template').html()),
    initialize: function(){
        this.input = $('#input-search'),
        this.render()
        gifCollection.on('add', this.render, this)
    },
    events: {
        'keyup #input-search' : 'inputChange',
    },
    inputChange: function(e){
        if(e.which != 13) return
        searchParam = this.input.val()
        gifCollection.url = `https://api.giphy.com/v1/gifs/search?api_key=XQNUHZUpVVVfq34YnWCKCZzzrT2ID3ES&q=${searchParam}&limit=25&offset=0&rating=g&lang=en`
        gifCollection.fetch()
        this.input.val('')
    },
    render: function(){
        // const imageData = {
        //     imageUrl: 'https://i.pinimg.com/564x/45/01/99/4501994654bfd6b3e7f00bdee856b590.jpg',
        //     title: 'hola mundo'
        // }
        // this.$el.append(this.template(imageData))
        this.$el.append(this.template())
        console.log(this.template())
        return this
    }
})

const gifView = new GifView()