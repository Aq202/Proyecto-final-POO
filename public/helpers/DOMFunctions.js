export class DOMFunctions{


    static moveElement(element, destinationQuery){

        if(!element || !destinationQuery) return;

        const $destination = document.querySelector(destinationQuery)
        $destination.appendChild(element);
    }
}