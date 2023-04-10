interface IRectangle
{
    x: number;
    y: number;
    width: number;
    height: number;
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

    contains(anotherRect: IRectangle): boolean {
        return (
            this.x  <=  anotherRect.x &&
            this.y  <=  anotherRect.y &&
            anotherRect.x + anotherRect.width  <= this.x + this.width &&
            anotherRect.y + anotherRect.height <= this.y + this.height
        )
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

export { Rectangle }