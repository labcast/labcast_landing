// Shared public copy. Labcast is in development; the roadmap names what ships when.
export const site = {
  name: 'Labcast',
  domain: 'https://labcast.ai',
  email: 'hello@labcast.ai',
  title: 'Labcast — Professional live shows from your phones',
  description:
    'Labcast turns the phones you already have into a professional live show. It switches angles, plays replays and adds graphics for you, so everyone who can’t be there gets the best seat. Join the waitlist for early access.',
  image: {
    path: '/social.png',
    width: 1200,
    height: 630,
    alt: 'Labcast logo beside an illustrated crew filming a basketball game. Your phones. One big show. Join the waitlist.',
  },
  signupVersion: '2026-11-02',
};
export const navigation = [
  { href: '/#workflow', label: 'How it works' },
  { href: '/#people', label: 'Made for you' },
  { href: '/#coming', label: 'What’s coming' },
  { href: '/#questions', label: 'Questions' },
];
export const audiences = [
  {
    id: 'streamer',
    label: 'For streamers and creators',
    title: 'More angles.\nMore of your show.',
    image: 'streamer',
    alt: 'A creator records at his desk with a phone and microphone.',
    text: 'Interviews, demos, IRL streams. Add your friends’ phones as extra cameras. Labcast cuts between them while you stay in the moment.',
    action: 'Get early access',
    note: 'Your voice. Your show.',
  },
  {
    id: 'organizer',
    label: 'For event organizers',
    title: 'Bring everyone\ninto the room.',
    image: 'audience',
    alt: 'A small audience listens to a speaker at a creative workshop.',
    text: 'Talks, meetups, hackathons, community nights. Your volunteers film on their phones. Labcast turns it into a live show for everyone who couldn’t make it.',
    action: 'Get early access',
    note: 'Every event deserves an audience.',
  },
  {
    id: 'club',
    label: 'For sports clubs',
    title: 'Every fan\ngets a seat.',
    image: 'game',
    alt: 'A young batter swings during a baseball game while a catcher waits.',
    text: 'Game day for the families and fans who can’t be there. Parents film from the sideline. Labcast follows the play and brings back the big moments.',
    action: 'Get early access',
    note: 'For the fans who can’t be there.',
  },
];
export const roadmap = [
  {
    id: 'pilot',
    stage: '01 / Pilot',
    title: 'Your phones become a broadcast.',
    items: [
      'Phone cameras and microphones from your crew',
      'Every phone recording in sync',
      'An automated director that cuts to the best angle',
      'Professional replays, slow motion included',
      'Titles, graphics and spoken commentary',
      'A production plan built from your event details',
      'You approve the crew and start or stop the show',
      'One streaming destination, set with its URL and key',
      'Step in and steer whenever you want',
    ],
  },
  {
    id: 'next',
    stage: '02 / Next',
    title: 'Less setup. More you.',
    items: [
      'Import events from Luma, Eventbrite and Meetup',
      'An event assistant that shapes your plan in chat',
      'Self-serve: buy hours, then start and stop on your own',
      'Exploring: laptop screens and venue sound desks as direct inputs',
    ],
  },
  {
    id: 'later',
    stage: '03 / Later',
    title: 'Bigger, bolder shows.',
    items: [
      'A music catalogue for your broadcasts',
      '3D scenes and effects',
      'More camera profiles for every kind of event',
      'Speaker names and live results in your graphics',
    ],
  },
];
export const questions = [
  {
    question: 'Can I use Labcast today?',
    answer:
      'Not yet. Labcast is in development, and early access is coming. Join the waitlist to be among the first in. There’s no launch date yet.',
  },
  {
    question: 'What happens after I join?',
    answer:
      'You get a few updates and an invite when early access opens. Nothing to install or pay.',
  },
  {
    question: 'What do I need?',
    answer:
      'Phones, people happy to film with them, and a solid internet connection at the venue. No cameras, switchers or editing software to buy.',
  },
  {
    question: 'Does everyone have to film?',
    answer:
      'No. You choose your crew and approve who joins. Watching and filming are separate choices.',
  },
  {
    question: 'Does my crew need training?',
    answer:
      'No. Labcast works with the views your crew gives it. It can suggest better framing, but nobody has to follow directions.',
  },
  {
    question: 'Can I stay in control?',
    answer:
      'Yes. Watch the live show, mute a microphone, drop a camera, show a holding screen or stop the broadcast whenever you want.',
  },
  {
    question: 'Where will viewers watch?',
    answer:
      'Wherever you stream. Each broadcast goes to one destination: paste the stream URL and key from your streaming platform, and Labcast sends the show there.',
  },
  {
    question: 'Do I need a laptop feed or a sound desk?',
    answer:
      'No. Phones capture the picture and the sound. We’re exploring direct laptop-screen and sound-desk inputs for later.',
  },
  {
    question: 'Will it work for my kind of event?',
    answer:
      'Labcast is built for live moments of every kind: streams, talks, meetups, hackathons, games and gigs. Tell us what you’re planning after you join.',
  },
  {
    question: 'What will it cost?',
    answer:
      'Joining the waitlist is free. Pricing isn’t set yet, and you’ll see it before you commit to anything.',
  },
];
