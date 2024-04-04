export const FOOTER = [{
    title: 'About',
    content: [
        {text: 'About us', path: '/metaphysics-course'},
        {text: 'Terms and conditions', path: '/terms-and-conditions'},
        {text: 'Privacy policy', path: '/privacy-policy'},
    ]},
    {
    title: 'Online courses',
    content: [
        {text: 'Course experience', path: '/course-experience'},
        {text: 'All Courses', path: '/all-courses'},
        {text: 'All Tutors', path: '/all-tutors'},
    ]},
    {
    title: 'Metaphysics service',
    content: [
        {text: 'Online fortune-telling', path: '/online-fortune-telling'},
        {text: 'Metaphysical information', path: '/metaphysical-information'},
        {text: 'Metaphysics goods', path: '/metaphysics-goods'},
        {text: 'Article sharing', path: '/article-sharing'},
    ]},
]

export const SOCIAL_NETWORK = [
    {icon: 'ic-ig.svg', path: 'https://www.instagram.com'},
    {icon: 'ic-fb.svg', path: 'https://www.facebook.com'},
    {icon: 'ic-youtube.svg', path: 'https://www.youtue.com'},
]

export type FOOTER_TYPE = {
    text: string,
    path: string
}

export type SN_TYPE = {
    icon: string,
    path: string
}