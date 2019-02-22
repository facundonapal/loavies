Varien.searchForm.prototype = Object.extend(Varien.searchForm.prototype, {

    initAutocomplete : function(url, destinationElement) {
        this.url = url;
        this.destinationElement = destinationElement;

        Event.observe($('search'),  'keyup', function () {
            if ($('search').value == "") {
                $('search_autocomplete').hide();
            }
        });

    },

    initAutocompleteDelayed : function(){
        url = this.url;
        destinationElement = this.destinationElement;

        var searchForm = this;
        var autocompleter = new Ajax.Autocompleter(
            this.field,
            destinationElement,
            url + '?categoryid=' + searchForm.getCategory(),
            {
                paramName: this.field.name,
                method: 'get',
                minChars: 2,
                updateElement: this._selectAutocompleteItem.bind(this),
                onComplete : function(element, update) {
                    $(destinationElement).show();
                }

            }
        );
        autocompleter.renderOriginal = autocompleter.render;
        autocompleter.render = function()
        {
            autocompleter.renderOriginal();
            if(!this.active || !this.index)
            {
                return;
            }

            var element = this.getEntry(this.index);
            if(!element)
            {
                return;
            }

            searchForm.updateFieldValue(element);

        }
    },

    _selectAutocompleteItem : function(element){

        this.updateFieldValue(element);
        if(element.hasClassName('product'))
        {
            window.location.href = element.down().href;
        }
        else if(this.field.value)
        {
            this.form.submit();
        }
    },

    updateFieldValue: function(element) {
        if(element.hasClassName('suggestion'))
        {
            this.field.value = element.innerHTML;
        }
        else if(element.hasClassName('product'))
        {
            this.field.value = element.down().title;
        }
        else if(element.title)
        {
            this.field.value = element.title;
        }
    },

    setCategory : function (categoryId) {
        this.categoryId = categoryId;
    },

    getCategory : function () {
        return this.categoryId;
    }
});