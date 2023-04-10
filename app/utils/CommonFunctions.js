import moment from "moment"
import { DAY_NAMES, MONTH_NAMES } from "../constants/Other"

export function printCreated(date) {
    let output = ''
    let dateObject = new Date(date)
    output = DAY_NAMES[dateObject.getDay()] +
        ', ' + dateObject.getDate() +
        ' de ' + MONTH_NAMES[dateObject.getMonth()] +
        ', del ' + dateObject.getFullYear()

    return output
}

export function containsOnlyNumbers(str) {
    return /^[0-9]+$/.test(str);
}

export function pagoAmigable(pago) {
    switch (pago) {
        case 'FULLY_REFUNDED':
            return "TOTALMENTE REEMBOLSADO"
            break;
        case 'PARTIALLY_REFUNDED':
            return "PARCIALMENTE REEMBOLSADO"
            break;
        case 'NOT_CHARGED':
            return "NO PAGADO"
            break;
        case 'FULLY_CHARGED':
            return "TOTALMENTE PAGADO"
            break;
        case 'PARTIALLY_CHARGED':
            return "PARCIALMENTE PAGADO"
            break;
    }
}

export function historialAmigable(eventType) {
    switch (eventType) {
        case 'DRAFT_CREATED':
            return {
                'ES': 'El borrador de orden fue creado.',
                'EN': 'The draft order was created'
            }
            break;
        case 'DRAFT_ADDED_PRODUCTS':
            return {
                'ES': 'Se agregaron algunos productos al pedido preliminar.',
                'EN': 'Some products were added to the draft order'
            }
            break;
        case 'DRAFT_REMOVED_PRODUCTS':
            return {
                'ES': 'Se eliminaron algunos productos del pedido preliminar.',
                'EN': 'Some products were removed from the draft order'
            }
            break;
        case 'PLACED':
            return {
                'ES': 'El pedido fue realizado.',
                'EN': 'The order was placed'
            }
            break;
        case 'PLACED_FROM_DRAFT':
            return {
                'ES': 'Se realizó el pedido preliminar.',
                'EN': 'The draft order was placed'
            }
            break;
        case 'OVERSOLD_ITEMS':
            return {
                'ES': 'El pedido preliminar se realizó con artículos sobrevendidos.',
                'EN': 'The draft order was placed with oversold items'
            }
            break;
        case 'CANCELED':
            return {
                'ES': 'El pedido fue cancelado.',
                'EN': 'The order was canceled'
            }
            break;
        case 'ORDER_MARKED_AS_PAID':
            return {
                'ES': 'El pedido se marcó manualmente como totalmente pagado.',
                'EN': 'The order was manually marked as fully paid'
            }
            break;
        case 'ORDER_FULLY_PAID':
            return {
                'ES': 'El pedido fue pagado en su totalidad.',
                'EN': 'The order was fully paid'
            }
            break;
        case 'UPDATED_ADDRESS':
            return {
                'ES': 'Se actualizó la dirección del pedido realizado.',
                'EN': 'The address from the placed order was updated'
            }
            break;
        case 'EMAIL_SENT':
            return {
                'ES': 'El correo electrónico de confirmación fue enviado.',
                'EN': 'The email was sent'
            }
            break;
        case 'PAYMENT_CAPTURED':
            return {
                'ES': 'El pago fue capturado.',
                'EN': 'The payment was captured'
            }
            break;
        case 'PAYMENT_REFUNDED':
            return {
                'ES': 'El pago fue devuelto.',
                'EN': 'The payment was refunded'
            }
            break;
        case 'PAYMENT_VOIDED':
            return {
                'ES': 'El pago fue anulado.',
                'EN': 'The payment was voided'
            }
            break;
        case 'PAYMENT_FAILED':
            return {
                'ES': 'El pago fue fallido.',
                'EN': 'The payment was failed'
            }
            break;
        case 'FULFILLMENT_CANCELED':
            return {
                'ES': 'Se canceló un cumplimiento.',
                'EN': 'A fulfillment was canceled'
            }
            break;
        case 'FULFILLMENT_RESTOCKED_ITEMS':
            return {
                'ES': 'Los artículos del cumplimiento fueron reabastecidos.',
                'EN': 'The items of the fulfillment were restocked'
            }
            break;
        case 'FULFILLMENT_FULFILLED_ITEMS':
            return {
                'ES': 'Algunos elementos se completaron.',
                'EN': 'Some items were fulfilled'
            }
            break;
        case 'TRACKING_UPDATED':
            return {
                'ES': 'Se envió el correo electrónico del código de seguimiento de cumplimiento.',
                'EN': 'The fulfillment tracking code email was sent'
            }
            break;
        case 'NOTE_ADDED':
            return {
                'ES': 'Se agregó una nota al pedido.',
                'EN': 'A note was added to the order'
            }
            break;
        case 'OTHER':
            return {
                'ES': 'Un evento de pedido desconocido que contiene un mensaje.',
                'EN': 'An unknown order event containing a message'
            }
            break;
        case 'ACCEPTED_CARRIER':
            return {
                'ES': 'El pedido fue aceptado por el transportista.',
                'EN': 'The order was accepted by a carrier'
            }
            break;
        case 'PICKED_UP_CARRIER':
            return {
                'ES': 'El pedido fue recogido por el transportista.',
                'EN': 'The order was picked up by a carrier'
            }
            break;
        case 'IN_TRANSIT':
            return {
                'ES': 'El pedido está en transportación.',
                'EN': 'The order is out for delivery'
            }
            break;
        case 'DELIVERED':
            return {
                'ES': 'El pedido fue entregado',
                'EN': 'The order was delivered'
            }
            break;
        case 'REJECTED':
            return {
                'ES': 'La orden fue rechazada',
                'EN': 'The order was rejected'
            }
            break;
        case 'LOST':
            return {
                'ES': 'Se perdió el pedido',
                'EN': 'The order was lost'
            }
            break;
    }
}

export function kycAmigable(kyc) {
    switch (kyc) {
        case 'APPROVED':
            return "APROBADO"
            break;
        /* case 'PARTIALLY_REFUNDED':
            return "PARCIALMENTE REEMBOLSADO"
            break;
        case 'NOT_CHARGED':
            return "NO PAGADO"
            break;
        case 'FULLY_CHARGED':
            return "TOTALMENTE PAGADO"
            break;
        case 'PARTIALLY_CHARGED':
            return "PARCIALMENTE PAGADO"
            break; */
        default:
            return "NO APROBADO"
    }
}

export function orderStatusDisplay(status) {
    switch (status) {
        case 'DRAFT':
            return "Borrador"
        case 'UNFULFILLED':
            return "No complemtada"
        case 'PARTIALLY_FULFILLED':
            return "Parcialmente completada"
        case 'FULFILLED':
            return "Completada"
        case 'CANCELED':
            return "Cancelada"
        case 'LOST':
            return "Perdida"
        default:
            return "Borrador"
    }
}

export function orderShippingStatusDisplay(status) {
    switch (status) {
        case 'NO_STATUS':
            return "Sin estado"
        case 'ACCEPTED_CARRIER':
            return "Aceptado por el mensajero"
        case 'PICKED_UP_CARRIER':
            return "Recogido por el mensajero"
        case 'IN_TRANSIT':
            return "En tránsito"
        case 'DELIVERED':
            return "Entregado"
        case 'REJECTED':
            return "Rechazado"
        case 'LOST':
            return "Perdida"
        default:
            return "Sin estado"
    }
}

export function orderPaymentStatusDisplay(status) {
    switch (status) {
        case 'NOT_CHARGED':
            return "No pagado"
        case 'PARTIALLY_CHARGED':
            return "Parcialmente pagado"
        case 'FULLY_CHARGED':
            return "Totalmente pagado"
        case 'PARTIALLY_REFUNDED':
            return "Parcialmente reembolsado"
        case 'FULLY_REFUNDED':
            return "Totalmente reembolsado"
        default:
            return "No pagado"
    }
}

export function currencySimbol(currency) {
    switch (currency) {
        case 'USD':
            return "$"
            break;
        case 'MLC':
            return "$"
            break;
        case 'EUR':
            return "€"
            break;
        default:
            return "$"
    }
}

export const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const getCurrencySimbol = (param) => {
    switch (param) {
        case 'EUR':
            return '€'
        case 'USD':
            return '$';
        case 'CUC':
            return '$';
        case 'CUP':
            return '$';

        default:
            return '$';
    }
}

export function stringToColour(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

const makeYearlyRule = (key, item, restData) => {
    if (restData[key]) {
        restData[key].push(item)
    } else {
        restData[key] = []
        restData[key].push(item)
    }
    if (item.start && item.endRecurringPeriod) {
        let cont = 1
        let startFromated = moment(item.start).add(cont, 'y').format("YYYY-MM-DD")
        const endFromated = moment(item.endRecurringPeriod).add(1, 'd').format("YYYY-MM-DD")
        while (startFromated < endFromated) {
            cont += 1
            if (restData[startFromated]) {
                restData[startFromated].push(item)
            } else {
                restData[startFromated] = []
                restData[startFromated].push(item)
            }
            startFromated = moment(item.start).add(cont, 'y').format("YYYY-MM-DD")
        }
    }
    return restData
}

const makeMonthlyRule = (key, item, restData) => {
    if (restData[key]) {
        restData[key].push(item)
    } else {
        restData[key] = []
        restData[key].push(item)
    }
    let cont = 1
    if (item.start && item.endRecurringPeriod) {
        let startFromated = moment(item.start).add(cont, 'M').format("YYYY-MM-DD")
        const endFromated = moment(item.endRecurringPeriod).add(1, 'd').format("YYYY-MM-DD")
        /* console.log('startFromated', startFromated)
        console.log('endFromated', endFromated) */
        while (startFromated <= endFromated) {

            cont += 1
            if (restData[startFromated]) {
                restData[startFromated].push(item)
            } else {
                restData[startFromated] = []
                restData[startFromated].push(item)
            }
            startFromated = moment(item.start).add(cont, 'M').format("YYYY-MM-DD")
        }
    }
    return restData

}

const makeWeeklyRule = (key, item, restData) => {
    if (restData[key]) {
        restData[key].push(item)
    } else {
        restData[key] = []
        restData[key].push(item)
    }
    if (item.start && item.endRecurringPeriod) {
        let cont = 1
        let startFromated = moment(item.start).add(cont, 'w').format("YYYY-MM-DD")
        const endFromated = moment(item.endRecurringPeriod).add(1, 'd').format("YYYY-MM-DD")
        while (startFromated <= endFromated) {
            cont += 1
            if (restData[startFromated]) {
                restData[startFromated].push(item)
            } else {
                restData[startFromated] = []
                restData[startFromated].push(item)
            }
            startFromated = moment(item.start).add(cont, 'w').format("YYYY-MM-DD")
        }
    }
    return restData
}

const makeDailyRule = (key, item, restData) => {
    if (restData[key]) {
        restData[key].push(item)
    } else {
        restData[key] = []
        restData[key].push(item)
    }
    if (item.start && item.endRecurringPeriod) {
        let cont = 1
        let startFromated = moment(item.start).add(cont, 'days').format("YYYY-MM-DD")
        const endFromated = moment(item.endRecurringPeriod).format("YYYY-MM-DD")
        while (startFromated <= endFromated) {
            cont += 1
            if (restData[startFromated]) {
                restData[startFromated].push(item)
            } else {
                restData[startFromated] = []
                restData[startFromated].push(item)
            }
            startFromated = moment(item.start).add(cont, 'days').format("YYYY-MM-DD")
        }
    }
    return restData
}

export function applyRules(newData, restData) {
    //console.log('applyRules')
    Object.entries(newData).forEach(([key, value]) => {
        //console.log('bject.entries(newData).forEach(([key, value]) => {')
        value.map((item, index) => {
            //console.log('value.map((item, index) => {')
            if (item.rule == null) {
                //console.log('if (item.rule == null) {')
                if (restData[key]) {
                    //console.log('if (restData[key]) {')
                    restData[key].push(item)
                } else {
                    //console.log('if (restData[key]) { elseeee')
                    restData[key] = []
                    restData[key].push(item)
                }
            } else {
                if (item.rule.frequency === 'DAILY') { // frecuencia diaria
                    restData = makeDailyRule(key, item, restData)
                }
                if (item.rule.frequency === 'WEEKLY') { // frecuencia semanal
                    restData = makeWeeklyRule(key, item, restData)
                }
                if (item.rule.frequency === 'MONTHLY') { // frecuencia mensual
                    restData = makeMonthlyRule(key, item, restData)
                }
                if (item.rule.frequency === 'YEARLY') { // frecuencia anual
                    restData = makeYearlyRule(key, item, restData)
                }
            }
        })
    });

    return restData
}

/* const applyRules = (dataRule) => {
    Object.entries(dataRule).forEach(([key, value]) => {
        value.map((item, index) => {
            if (item.rule == null) {
                if (testDelivery[key]) {
                    testDelivery[key].push(item)
                } else {
                    testDelivery[key] = []
                    testDelivery[key].push(item)
                }
            } else {
                if (item.rule.frequency === 'NEVER') { // frecuencia nunca
                    if (testDelivery[key]) {
                        testDelivery[key].push(item)
                    } else {
                        testDelivery[key] = []
                        testDelivery[key].push(item)
                    }
                }
                if (item.rule.frequency === 'DAILY') { // frecuencia diaria
                    makeDailyRule(key, item)
                }
                if (item.rule.frequency === 'WEEKLY') { // frecuencia semanal
                    makeWeeklyRule(key, item)
                }
                if (item.rule.frequency === 'MONTHLY') { // frecuencia mensual
                    makeMonthlyRule(key, item)
                }
                if (item.rule.frequency === 'YEARLY') { // frecuencia anual
                    makeYearlyRule(key, item)
                }
            }

        })
    });
} */