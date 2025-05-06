const {EventEmitter} = require('./EventEmitter');

describe('EventEmitter', () => {
    let emitter;

    beforeEach(() => {
        emitter = new EventEmitter();
    });

    test('should call listener when event is emitted', () => {
        const mockFn = jest.fn();
        emitter.on('test', mockFn);
        emitter.emit('test', 1, 2);
        expect(mockFn).toHaveBeenCalledWith(1, 2);
    });

    test('should not call listener after it is removed', () => {
        const mockFn = jest.fn();
        emitter.on('test', mockFn);
        emitter.off('test', mockFn);
        emitter.emit('test');
        expect(mockFn).not.toHaveBeenCalled();
    });

    test('should call multiple listeners for the same event', () => {
        const fn1 = jest.fn();
        const fn2 = jest.fn();
        emitter.on('test', fn1);
        emitter.on('test', fn2);
        emitter.emit('test', 'a');
        expect(fn1).toHaveBeenCalledWith('a');
        expect(fn2).toHaveBeenCalledWith('a');
    });

    test('should only call once listener once', () => {
        const mockFn = jest.fn();
        emitter.once('test', mockFn);
        emitter.emit('test');
        emitter.emit('test');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should not fail if removing a non-existent listener', () => {
        expect(() => emitter.off('test', () => {})).not.toThrow();
    });

    test('should not call listeners for other events', () => {
        const mockFn = jest.fn();
        emitter.on('foo', mockFn);
        emitter.emit('bar');
        expect(mockFn).not.toHaveBeenCalled();
    });
});
