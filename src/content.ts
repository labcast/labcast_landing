// Shared public copy. Capabilities describe the product in development.
export const site = {
  name: 'Labcast',
  domain: 'https://labcast.ai',
  email: 'hello@labcast.ai',
  title: 'Labcast — Live broadcasting from your phones',
  description:
    'Turn phone cameras into a live broadcast. Labcast handles switching, replays, graphics, and commentary for creators, events, and sports. Join the waitlist.',
  image: {
    path: '/social.png',
    width: 1200,
    height: 630,
    alt: 'Labcast logo and an illustrated crew filming a basketball game. Your phones. One big show. Join the waitlist.',
  },
  signupVersion: '2026-10-16',
};
export const navigation = [
  { href: '/#workflow', label: 'How it works' },
  { href: '/#people', label: 'Made for you' },
  { href: '/#questions', label: 'Questions' },
];
export const audiences = [
  {
    id: 'streamer',
    label: 'For streamers',
    title: 'More angles.\nMore of your show.',
    image: 'streamer',
    alt: 'A creator records at his desk with a phone and microphone.',
    text: 'Interviews, demos, IRL adventures. Bring more of your world into the frame, with your personality at the center.',
    action: 'Join as a streamer',
    note: 'Your voice. Your show.',
  },
  {
    id: 'organizer',
    label: 'For event organizers',
    title: 'The room is only\nthe beginning.',
    image: 'audience',
    alt: 'A small audience listens to a speaker at a creative workshop.',
    text: 'You bring people together. We’re building a way to bring the moment to the people who can’t be in the room.',
    action: 'Join as an organizer',
    note: 'Small event. Bigger possibilities.',
  },
  {
    id: 'club',
    label: 'For sports clubs',
    title: 'Bring them\nto the sideline.',
    image: 'game',
    alt: 'A young batter swings during a baseball game while a catcher waits.',
    text: 'For the families and fans who can’t make game day. We’re exploring coordinated phone broadcasts for local clubs.',
    action: 'Join for my club',
    note: 'For the fans who can’t be there.',
  },
];
export const questions = [
  {
    question: 'Can I use Labcast right now?',
    answer:
      'Labcast is in development. Join the waitlist for updates and to hear when early access opens. There isn’t a public launch date yet.',
  },
  {
    question: 'What would I need?',
    answer:
      'The plan is to work with phone cameras, people willing to film, and suitable internet at the venue. Audio, power, and camera positions also matter.',
  },
  {
    question: 'Does everyone at the event have to film?',
    answer:
      'No. Labcast is being built for willing volunteers or your chosen camera crew. Attending and filming are separate choices.',
  },
  {
    question: 'Do we have to follow camera directions?',
    answer:
      'No. Labcast is being built to work with the views your crew provides. Camera tips are optional. You can let Labcast handle the production without directing the people filming.',
  },
  {
    question: 'Can I stay in control?',
    answer:
      'Yes. We’re building in the ability to steer the show and take over whenever you want.',
  },
  {
    question: 'Does this replace my current streaming tools?',
    answer:
      'Labcast is focused on producing a live show from phone cameras. Supported workflows and connections will be confirmed before early access.',
  },
  {
    question: 'Where will viewers watch?',
    answer:
      'We’re building direct streaming to Twitch, YouTube, TikTok, and Instagram. Platform support, simultaneous streaming, and account eligibility will be confirmed before early access.',
  },
  {
    question: 'Will it work for our sport?',
    answer:
      'We’re exploring youth and community sports and will validate specific formats first. Tell us your sport after joining so we can understand what your club needs.',
  },
  {
    question: 'What will it cost?',
    answer:
      'The waitlist is free to join. Product pricing is still being worked out. We’ll share pricing before you commit to anything.',
  },
];
