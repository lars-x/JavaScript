// lars_ is poor mans namespace...

export const deg2rad = Math.PI / 180.0;

export function calc_pie_area(radius, angle_deg) {
    const res = angle_deg / 360.0 * Math.PI * radius * radius;
    return res;
}
