// Just the Buffer methods collector.mjs uses. subarray() keeps this class through the typed-array species.
export class Buffer extends Uint8Array {
    static from(value) {
        if (typeof value === 'string') {
            const bin = atob(value);
            const b = new Buffer(bin.length);
            for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
            return b;
        }
        const b = new Buffer(value.length);
        b.set(value);
        return b;
    }
    view() { return new DataView(this.buffer, this.byteOffset, this.byteLength); }
    toString(encoding) {
        if (encoding !== 'base64') return super.toString();
        let bin = '';
        for (let i = 0; i < this.length; i++) bin += String.fromCharCode(this[i]);
        return btoa(bin);
    }
    readUInt16LE(at) { return this.view().getUint16(at, true); }
    readBigUInt64LE(at) { return this.view().getBigUint64(at, true); }
    readBigInt64LE(at) { return this.view().getBigInt64(at, true); }
}
