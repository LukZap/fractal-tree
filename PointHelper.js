class PointHelper {
    static CalculateAngleFromPoints(sp, ep) {
        var x = ep.x - sp.x;
        var y = sp.y - ep.y;
        return Math.atan2(y, x);
    }

    static CalculateLengthFromPoints(sp, ep) {
        var x = ep.x - sp.x;
        var y = ep.y - sp.y;
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
}
