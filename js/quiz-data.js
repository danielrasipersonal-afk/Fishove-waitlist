// Testin kysymykset ja tulosprofiilit.
const questions = [
  {
    title: ['A free Saturday.', 'No plans'],
    hint: 'What sounds best?',
    choices: [
      ['Adventure 🌍', 'A little <em>adventure</em> somewhere<br>new. I’d like to <em>Discover</em> new<br>places', 'adventurer'],
      ['Date ❤️', '<em>Date with</em> someone<br>interesting, Find <em>romance</em><br>from life', 'romantic'],
      ['Helping 🫴', '<em>Helping out</em> an animal<br>shelter. <em>give something</em> to<br>the community', 'giver'],
      ['Friends 😎', 'Getting my <em>favorite people</em><br>together, <em>call your friends</em> &<br>hang out', 'connector']
    ]
  },
  {
    title: ['A little surprise for', 'someone'],
    hint: 'You get to make someone’s day. Pick your move.',
    choices: [
      ['Road trip🔥', '<em>Take someone on</em> an<br>unplanned <em>road trip</em>, just for the<br>adventure.', 'adventurer'],
      ['Special Dinner 🕯️', 'Surprise someone with a<br><em>cosy dinner</em> and your<br>undivided attention.', 'romantic'],
      ['Surprise party 🎉', 'Bring their <em>friends together</em><br>for a <em>celebration</em> they won’t<br>see coming.', 'connector'],
      ['Good cause 💌', '<em>Make a donation</em> to a cause<br>close to their heart.', 'giver']
    ]
  },
  {
    title: ['That was a', 'good day.'],
    hint: 'Pick the ending that makes you smile.',
    choices: [
      ['+ Adventures 🎸', 'We should get lost more often. I<br>loved discovering <em>somewhere</em><br><em>new</em>', 'adventurer'],
      ['One moment 💕', 'I didn’t want the <em>date to end</em>.<br>We talked for hours but I still<br>felt like there was <em>so much</em><br><em>more</em>', 'romantic'],
      ['Good done 👌', 'We actually <em>made a</em><br><em>difference</em>. Knowing that<br>someone’s <em>day is a little</em><br><em>better</em>', 'giver'],
      ['Let’s go again 🥳', 'Same time <em>next week!</em> I<br>didn’t realise how much I<br>needed <em>an evening</em>', 'connector']
    ]
  }
];

const romanticCopy = [
  'You find magic in making someone feel special. A',
  'thoughtful date, a handwritten note, a conversation',
  'that outlasts the candles. You make ordinary',
  'moments feel like a first.'
];
const profiles = {
  adventurer: ['Adventurer', 'Love looks like an open road.', romanticCopy],
  romantic: ['Romantic', 'Love looks like a little spark.', romanticCopy],
  giver: ['The Giver', 'Love looks like giving a little.', [
    'You turn a feeling into something good. A helping',
    'hand, a thoughtful donation, a moment spent',
    'making someone’s day. Your kind of love leaves the',
    'world a little softer.'
  ]],
  connector: ['Connector', 'Love looks like being together.', [
    'An extra chair at the table. A message in the group',
    'chat. One more reason to get everyone together.',
    'You have a gift for making people feel like they',
    'belong.'
  ]]
};

