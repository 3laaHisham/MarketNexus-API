// this file is to test order.service.js file
const orderService = require("services\order\order.service.js");


async function setupTest() {
    //write function that connects to mongo and create a user in mongodb



}
describe("testing order.service.js", async () => {
    test("testing function createNewOrder", async () => {
        let fakeUserID;
        let fakeOrder = {}
        expect(orderService.createNewOrder(fakeUserID, fakeOrder)).to
    })

});