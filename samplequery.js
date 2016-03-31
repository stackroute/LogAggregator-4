var query = {

  select: ['authorName', 'authorEmail','insertions','deletions'],
  eval: {
    val1: {
      rolling: {
        evaluate: 'average',
        over: {
          count: 10
        },
        on: 'deletions' // measure
      }
    },
    val2: {
      rolling: {
        evaluate: 'average',
        over: {
          count: 10
        },
        on: 'insertions'
      }
    },
  },
  project: {
    $highlight: {$condition: 'tempdata.val1 == tempdata.val2'}
  },
  to: 'streamB'
}
module.exports=query;
// var output = {
//   dimension1: '',
//   dimension2: '',
//   measure3: '',
//   measure4: '',
//   val1: '',
//   val2: '',
//   $highlight: true // This property should either exist with a true value, or not exist at all.
// }
