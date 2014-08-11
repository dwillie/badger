getCardText = function(card) {
    return card.getElementsByClassName("js-card-name")[0].innerHTML
}

processList = function(list) {
     = new RegExp(/\((.*)\)/)

    cards = list.getElementsByClassName("list-cards");
    for (var i = 0; i < cards.length; i++)
    {
        cardText = cards[i].getElementsByClassName("js-card-name")[0].innerHTML

    }
}

main = function() {
    lists = document.getElementsByClassName("list");
    for (var i = 0; i < lists.length; i++) {
        console.log("List!");
        processList(lists[i]);
    }

    // setTimeout(main, 1000);
}

window.onload = main
