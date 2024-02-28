interface IRectangle
{
    x: number;
    y: number;
    width: number;
    height: number;
}

interface IPoint {
    x: number,
    y: number
}

class Rectangle
{
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(rect: IRectangle) {

        this.x = rect.x;
        this.y = rect.y;
        this.width  = rect.width;
        this.height = rect.height;
    }

    get top() {
        return this.y;
    }   

    get right() {
        return this.x + this.width;
    }

    get bottom() {
        return this.y + this.height;
    }

    contains(anotherRect: IRectangle): boolean {
        return (
            this.x  <=  anotherRect.x &&
            this.y  <=  anotherRect.y &&
            anotherRect.x + anotherRect.width  <= this.x + this.width &&
            anotherRect.y + anotherRect.height <= this.y + this.height
        )
    }

    // @todo missing test
    includes(point: IPoint): boolean {
        return (
            this.x <= point.x &&
            this.y <= point.y &&
            point.x <= this.x + this.width &&
            point.y <= this.y + this.height
        )
    }

    getCenter(): IPoint {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
        }
    }

    intersectsWith(rect: IRectangle): boolean {
        return  !(
            rect.x > this.x + this.width ||
            rect.x + rect.width < this.x ||
            rect.y > this.y + this.height || 
            rect.y + rect.height < this.y
        );

    }

    public static createBounding(rects: IRectangle[]): Rectangle {
        const x: number = Math.min(...rects.map(r => r.x));
        const y: number = Math.min(...rects.map(r => r.y));
        const right:  number = Math.max(...rects.map(r => r.x + r.width)); 
        const bottom: number = Math.max(...rects.map(r => r.y + r.height));

        return new Rectangle({x, y, width: right - x, height: bottom - y})
    }
}

// @todo missing test
function calcDistance(a: IPoint, b: IPoint): number {

    return Math.sqrt(
        Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)
    )
}

export { Rectangle, calcDistance }

export type { IRectangle, IPoint }