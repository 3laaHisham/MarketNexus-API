const userService = require("../../../services/user/user.service");
const setup = require("../../setupTest");
const fakeUsers = require("../../fakeData/fakeUsers");
const { expect } = require("chai");
const dbName = "test";
const collectionName = "users";
async function addFakeUsers(arrUserIndex) {
    let arr = [];

    for (let i = 0; i < arrUserIndex.length; i++) {
        arr.push(fakeUsers.users[i]);
    }
    await setup.run(setup.insertCallback(dbName, collectionName, arr));
    return arr
}
test("testing getUsers ", async () => {
    if (!await setup.run(setup.clearCollection(dbName, collectionName)))
        return null;
    let arr = await addFakeUsers([0, 1, 2]);
    const result = await userService.getUsers();
    expect(result.status).toBe(200);
    expect(result.message).toBe("User retrieved successfully");
    expect(result.length).toEqual(arr.length);
    for (let i = 0; i < arr.length; i++) {
        expect(result.result[i]).toBe(arr[i]);
    }
});
test("testing update user name ", async () => {

    let arr = await addFakeUsers([0, 1, 2]);
    const currUser = setup.run(setup.findCallback(dbName, collectionName, { name: fakeUsers.users[0].name }));
    if (!currUser)
        addFakeUsers([1, 2, 3]);
    user.name = "new name";
    const result = await userService.updateUser(currUser.name, { $set: { name: "new name0" } });

    expect(result.status).toBe(200);
    expect(result.message).toBe("User updated successfully")
    expect(result).toBeTruthy();
    expect(result.name).toEqual("new name0");
});


