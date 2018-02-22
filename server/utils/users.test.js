const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: '1',
        name: 'Mike',
        room: 'Node Course',
      },
      {
        id: '2',
        name: 'Jen',
        room: 'React Course',
      },
      {
        id: '3',
        name: 'Julie',
        room: 'Node Course',
      },
    ];
  });

  it('should add new user', () => {
    const user = { id: '123', name: 'Andrew', room: 'The Office Fans' };
    users.addUser(user.id, user.name, user.room);
    expect(users.users).toContainEqual(user);
  });

  it('should return all users from Node Course', () => {
    const roomUsers = users.getUserList('Node Course');

    expect(roomUsers.length).toBe(2);
    expect(roomUsers).toContainEqual(users.users[0].name);
    expect(roomUsers).toContainEqual(users.users[2].name);
  });

  it('should return all users from React Course', () => {
    const roomUsers = users.getUserList('React Course');

    expect(roomUsers.length).toBe(1);
    expect(roomUsers).toContainEqual(users.users[1].name);
  });

  it('should remove an existent user', () => {
    const expectedRemoveUser = users.users[1];
    const removedUser = users.removeUser(expectedRemoveUser.id);

    expect(users.users.length).toBe(2);
    expect(users.users).not.toContainEqual(expectedRemoveUser);
    expect(removedUser).toEqual(expectedRemoveUser);
  });

  it('should not remove an inexistent user', () => {
    const removedUser = users.removeUser('asdfasd');

    expect(users.users.length).toBe(3);
    expect(removedUser).toBeFalsy();
  });

  it('should get a existent user', () => {
    const expectedUser = users.users[1];
    const user = users.getUser(expectedUser.id);

    expect(user).toEqual(expectedUser);
  });

  it('should not get a inexistent user', () => {
    const user = users.getUser('asdfasdgdsa');
    expect(user).toBeFalsy();
  });
});
