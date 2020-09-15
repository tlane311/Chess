import MongoClient from 'mongodb'

const url = 'mongodb://localhost:27017';

export async function createUser(username, email, hashedPassword){
    return new Promise( (resolve,reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, async (err,client) => {
            if (err) {
                reject(err);
                client.close();
            }
            
            const db = client.db('chess');
            await db.collection('users')
            .countDocuments({  email: email  })
            .then( async result => {
                if (result === 1) {
                    reject('This email is already in use');
                } else {
                    await db.collection('users')
                    .countDocuments({  username: username  })
                    .then( addUserCallback );
                }
            })
            .catch( err => reject(err) )
            .finally( () => client.close() );
            
            

            async function addUserCallback(result, err){
                if (err) reject(err);
                if (!result) {
                    await db.collection('users')
                    .insertOne({
                        username: username,
                        email: email,
                        password: hashedPassword
                    })
                    .then( (result) => {
                        result.result.n===1
                        ? resolve("The user was successfully added.")
                        : reject("The user was not added.");
                        
                    });
                } else {
                    reject('This username is already in use.');
                }
            }
        });   
    }).then(result => `Success: ${result}`)
    .catch( err => `Error: ${err}`);
}



export async function deleteUser(username,email,hashedPassword){
    return new Promise( (resolve, reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, (err,client) => {
            if (err) reject(err);
            const db = client.db('chess');        
            db.collection('users')
            .deleteOne({
                username: username,
                email: email,
                password: hashedPassword
            })
            .then( (result) => {
                if (result.result.n < 1){
                    reject("No users were found");
                } else {
                    resolve('The user was deleted');
                }
            })
            .finally( () => client.close() );
        })
    }).then(result => `Success: ${result}`)
    .catch( err => `Error: ${err}`);


export async function doesUserExist(username,email){
    return new Promise( (resolve,reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, async (err,client) => {
            if (err) reject(err);
            const db = client.db('chess');
            await db.collection('users')
            .countDocuments({
                username: username,
                email: email  
            })
            .then( (result, err) => {
                if (err) reject(err);
                resolve(Boolean(result));
            })
            .finally( () => client.close());
        });
    }).then(result => `Success: ${result}`)
    .catch( err => `Error: ${err}`);
}

export async function updateUser(username,email, hashedPassword, updatedKey, updatedValue){
    return new Promise( (resolve,reject) => {
        if (updatedValue===username || updatedValue===email || updatedValue===hashedPassword){
            reject(`Choose a different ${updatedKey}`);
        }
        MongoClient.connect(url, { useUnifiedTopology: true }, async (err,client) => {
            if (err) {
                reject(err);
                client.close();
            }
            
            const db = client.db('chess');
            await db.collection('users')
            .countDocuments({
                username: username,
                email: email,
                password: hashedPassword
            })
            .then(updateCallback)
            .catch(err => {
                reject(err);
            })
            .finally(() => client.close() )
            
            
            async function updateCallback(result, err){
                if (err) {
                    reject(err);
                }
                if (result) {
                    await db.collection('users')
                    .updateOne(
                        {
                            username: username,
                            email: email,
                            password: hashedPassword
                        },
                        {
                            $set: { [updatedKey]: updatedValue},
                        }
                    )
                    .then( (result) => {
                        result.result.n===1
                        ? resolve(`Updated this user's ${updatedKey}.`)
                        : reject(`The user's data was not updated.`);
                    });
                } else {
                    reject('User was not found');
                }   
            }
        })
    }).then(result => `Success: ${result}`)
    .catch( err => `Error: ${err}`);
}

/* unit test -- probably need to test update a bit more
const username='w',
email='w@w',
hashedPassword='123',
secondEmail='q@q'

export async function testUserServices(){
    await doesUserExist(username,email); //Success: false
    
    await createUser(username,email,hashedPassword); //Success: The user was successfully added
    await doesUserExist(username,email); //Success: true
    
    await createUser(username,email,hashedPassword); //Error: This email is already in use
    await createUser(username,secondEmail,hashedPassword); //Error: This username is already in use.
    
    await deleteUser(username,email,hashedPassword); //Success: The user was deleted
    await doesUserExist(username,email); //Success: false
    
    await deleteUser(username,email,hashedPassword); //Error: No users were found
    await doesUserExist(username,email); //Success: false

    await createUser(username,email,hashedPassword); //Success: The user was successfully added.
    await doesUserExist(username,email); //Success: true
    await updateUser(username, email,hashedPassword,'email',secondEmail); //Success: Updated this user's email.
    await updateUser(username, secondEmail, hashedPassword,'email', email); //Success: Updated this user's email.
    await updateUser(username, secondEmail, hashedPassword,'email', email); //Error: User was not found
    await updateUser(username, email,hashedPassword,'email',email); //Error: Choose a different email
    await deleteUser(username, email, hashedPassword) //Success: The user was deleted

    await createUser(username,email,hashedPassword); //Success: The user was successfully added.
    await doesUserExist(username,email); //Success: true
    await updateUser(username, email,hashedPassword,'username','q'); //Success: Updated this user's username.
    await updateUser(username, 'q', hashedPassword,'username', username); //Error: Choose a different username
    await updateUser('q', email, hashedPassword,'username', username); //Success: Updated this user's username.
    await deleteUser(username, email, hashedPassword); //Success: The user was deleted
}

testUserServices()

*/