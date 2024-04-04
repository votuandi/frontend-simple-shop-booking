export const NAV_BAR : NAV_BAR_TYPE[] = [
    {text: 'Home', path: '/', subs: []},
    {text: 'Metaphysics course', path: '/all-courses', subs: []},
    {text: 'Fortune telling', path: '/fortune-telling', subs: [
        {text: 'Tarot', path: '/tarot'},
        {text: 'Qimen dunjia', path: '/qimen-dunjia'}
    ]},
    {text: 'Metaphysical information', path: '/metaphysical-information', subs: []},
    // {text: 'Metaphysics goods', path: '/metaphysics-goods', subs: []},
    {text: 'Article sharing', path: '/article', subs: []},
]

export type NAV_BAR_TYPE = {
    text: string,
    path: string,
    subs: NAV_SUB_TYPE[]
}

export type NAV_SUB_TYPE = {
    text: string,
    path: string,
}