export default {
  'top-viewed-articles': {
    disabled: false,
    fullName: 'Top Viewed Articles',
    subtitle: 'Most viewed articles',
    description: 'Most viewed articles',
    question: 'What are the most viewed articles?',
    infoUrl: 'https://meta.wikimedia.org/wiki/Research:Page_view',
    type: 'list',
    structure: 'top',
    defaults: {
      unique: {
        project: ['all-projects'],
        access: ['all-access']
      },
      common: {
        metric: 'top-viewed-articles',
        granularity: 'monthly'
      }
    },
    value: 'views',
    key: 'article',
    arrayName: 'articles',
    area: 'reading',
    global: false,
    additive: true
  },
  'page-views-by-country': {
    disabled: false,
    fullName: 'Page Views by Country',
    subtitle: 'Countries with the most views',
    description: 'Countries where this project is visited the most. Those countries with less than 100 views are not reported and are blank in the map.',
    question: 'Where are the project\'s visitors coming from?',
    infoUrl: 'https://meta.wikimedia.org/wiki/Research:Page_view',
    type: 'map',
    defaults: {
      unique: {
        project: ['all-projects'],
        access: ['all-access']
      },
      common: {
        metric: 'page-views-by-country',
        granularity: 'monthly'
      }
    },
    value: 'views',
    key: 'country',
    arrayName: 'countries',
    area: 'reading',
    global: true,
    structure: 'top',
    additive: true
  },
  'total-page-views': {
    disabled: false,
    fullName: 'Total Page Views',
    description: 'Page views on Wikimedia projects count the viewing of article content.  In this data we try to exclude bot traffic and focus on human user page views',
    question: 'How many times are articles viewed?',
    infoUrl: 'https://meta.wikimedia.org/wiki/Research:Page_view',
    endpoint: '/pageviews/aggregate/{{project}}/{{access}}/{{agent_type}}/{{granularity}}/{{start}}/{{end}}',
    defaults: {
      unique: {
        project: ['all-projects'],
        access: ['all-access']
      },
      common: {
        metric: 'total-page-views',
        agent_type: 'user',
        granularity: 'monthly'
      }
    },
    type: 'lines',
    structure: 'timeseries',
    area: 'reading',
    value: 'views',
    global: true,
    breakdowns: [{
      name: 'Access method',
      breakdownName: 'access',
      values: [
        { name: 'Desktop', on: true, key: 'desktop' },
        { name: 'Mobile App', on: true, key: 'mobile-app' },
        { name: 'Mobile Web', on: true, key: 'mobile-web' }
      ]
    }],
    additive: true
  },
  'unique-devices': {
    disabled: false,
    fullName: 'Unique Devices',
    description: 'How many distinct devices we have visiting a project in a given time period',
    question: 'How many unique devices access content?',
    infoUrl: 'https://meta.wikimedia.org/wiki/Research:Unique_Devices',
    type: 'lines',
    structure: 'timeseries',
    defaults: {
      unique: {
        project: ['all-projects'],
        'access-site': ['all-sites']
      },
      common: {
        metric: 'unique-devices',
        granularity: 'monthly'
      }
    },
    value: 'devices',
    area: 'reading',
    global: false,
    breakdowns: [{
      name: 'Access site',
      breakdownName: 'access-site',
      values: [
        { name: 'Mobile Site', on: true, key: 'mobile-site' },
        { name: 'Desktop Site', on: true, key: 'desktop-site' }
      ]
    }],
    additive: false
  },'absolute-bytes-diff': {
        disabled: false,
        fullName: 'Absolute bytes diff',
        description: 'The sum of the absolute differences in bytes made by each edit (or revision), including edits on redirects. In other words, counting negative differences as positive',
        question: 'What are the total number of bytes added and removed?',
        infoUrl: 'https://meta.wikimedia.org/wiki/Research:Wikistats_metrics/Bytes#Absolute_Bytes_Difference',
        defaults: {
            unique: {
                project: ['all-projects'],
                editor_type: ['all-editor-types'],
                page_type: ['all-page-types']
            },
            common: {
                granularity: 'monthly',
                metric: 'absolute-bytes-diff'
            }
        },
        type: 'bars',
        structure: 'timeseries',
        area: 'content',
        value: 'abs_bytes_diff',
        unit: 'bytes',
        global: true,
        breakdowns: [{
            name: 'User type',
            breakdownName: 'editor_type',
            values: [
                { name: 'Anonymous', on: true, key: 'anonymous' },
                { name: 'Group bot', on: true, key: 'group-bot' },
                { name: 'Name bot', on: true, key: 'name-bot' },
                { name: 'User', on: true, key: 'user' },
            ]
        },{
            name: 'Page type',
            breakdownName: 'page_type',
            values: [
                { name: 'Content', on: true, key: 'content' },
                { name: 'Non content', on: true, key: 'non-content' }
            ]
        }],
        additive: false
    },
    'edited-pages': {
        disabled: false,
        fullName: 'Edited pages',
        description: 'The number of pages edited, excluding redirect pages',
        question: 'How many pages are edited?',
        infoUrl: 'https://meta.wikimedia.org/wiki/Research:Wikistats_metrics/Edited_pages',
        defaults: {
            unique: {
                project: ['all-projects'],
                editor_type: ['all-editor-types'],
                page_type: ['all-page-types'],
                activity_level: ['all-activity-levels']
            },
            common: {
                granularity: 'monthly',
                metric: 'edited-pages'
            }
        },
        type: 'lines',
        structure: 'timeseries',
        area: 'content',
        value: 'edited_pages',
        global: false,
        breakdowns: [{
            name: 'Editor type',
            breakdownName: 'editor_type',
            values: [
                { name: 'Anonymous', on: true, key: 'anonymous' },
                { name: 'Group bot', on: true, key: 'group-bot' },
                { name: 'Name bot', on: true, key: 'name-bot' },
                { name: 'User', on: true, key: 'user' },
            ]
        },{
            name: 'Page type',
            breakdownName: 'page_type',
            values: [
                { name: 'Content', on: true, key: 'content' },
                { name: 'Non content', on: true, key: 'non-content' }
            ]
        },{
            name: 'Activity level',
            breakdownName: 'activity_level',
            values: [
                { name: '1 to 4 edits', key: '1..4-edits', on: true },
                { name: '5 to 24 edits', key: '5..24-edits', on: true },
                { name: '25 to 99 edits', key: '25..99-edits', on: true },
                { name: '100 or more edits', key: '100..-edits', on: true }
            ]
        }],
        additive: true
    },
    'net-bytes-difference': {
        disabled: false,
        fullName: 'Net bytes difference',
        description: 'The sum of the differences in bytes made by each edit (or revision), including edits on redirects',
        question: 'How did the overall size in bytes change since last period?',
        infoUrl: 'https://meta.wikimedia.org/wiki/Research:Wikistats_metrics/Bytes#Net_Bytes_Difference',
        defaults: {
            unique: {
                project: ['all-projects'],
                editor_type: ['all-editor-types'],
                page_type: ['all-page-types']
            },
            common: {
                granularity: 'monthly',
                metric: 'net-bytes-difference'
            }
        },
        type: 'bars',
        structure: 'timeseries',
        area: 'content',
        unit: 'bytes',
        value: 'net_bytes_diff',
        global: true,
        breakdowns: [{
            name: 'User type',
            breakdownName: 'editor_type',
            values: [
                { name: 'Anonymous', on: true, key: 'anonymous' },
                { name: 'Group bot', on: true, key: 'group-bot' },
                { name: 'Name bot', on: true, key: 'name-bot' },
                { name: 'User', on: true, key: 'user' },
            ]
        },{
            name: 'Page type',
            breakdownName: 'page_type',
            values: [
                { name: 'Content', on: true, key: 'content' },
                { name: 'Non content', on: true, key: 'non-content' }
            ]
        }],
        additive: false
    },
}