class axios {

    request() {

        console.log('request')

    }

    a() {

        console.log('a')

    }

    b() {

        console.log('b')

    }

}

function createInstance() {

    let ctx = new axios()

    let instance= axios.prototype.request.bind(ctx)

    extend(instance, ctx)

    return instance

}

function extend(to, from) {

    for (var key in from) {

        to[key] = from[key];

    }

    return to;

}

let testInstance = createInstance()

testInstance()

testInstance.a()