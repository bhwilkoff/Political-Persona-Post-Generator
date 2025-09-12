import type { PoliticalViewpoint, NewsSource } from './types';

export const POLITICAL_VIEWPOINTS: PoliticalViewpoint[] = [
  {
    id: 'anarcho-communist',
    name: 'Anarcho-Communist',
    description: 'A political philosophy that advocates for the abolition of the state, capitalism, wage labor, and private property. It envisions a society based on voluntary associations, mutual aid, and direct democracy, where resources are held in common and freely accessible to all. The focus is on achieving a stateless, classless society through revolutionary means, emphasizing both individual freedom and collective well-being without hierarchical structures.',
  },
  {
    id: 'anarchist',
    name: 'Anarchist',
    description: 'A political philosophy that opposes all forms of coercive hierarchy and authority, particularly the state. Anarchists advocate for a society based on voluntary, cooperative institutions and free associations. While some anarchists are communists, the broader term encompasses various schools of thought, all united by the core belief that society can and should be organized without a ruling government body. The emphasis is on individual liberty, autonomy, and the rejection of all forms of domination.',
  },
  {
    id: 'communist',
    name: 'Communist',
    description: 'A political and economic ideology that positions itself in opposition to liberal democracy and capitalism, advocating instead for a classless system in which the means of production are owned communally and private property is nonexistent or severely curtailed. It generally supports a revolutionary overthrow of the existing capitalist system to establish a "dictatorship of the proletariat" as a transitional stage towards a stateless, communist society.',
  },
  {
    id: 'marxist-leninist',
    name: 'Marxist-Leninist',
    description: 'A communist ideology that was the official ideology of the Soviet Union. It follows the theories of Karl Marx and Friedrich Engels but adapts them with the contributions of Vladimir Lenin. It emphasizes the leadership of a single, disciplined vanguard party to lead the proletariat in a revolution to overthrow capitalism and establish a socialist state, which would then develop into a fully communist society. It is characterized by central planning of the economy and a one-party political system.',
  },
  {
    id: 'democratic-socialist',
    name: 'Democratic Socialist',
    description: 'A political philosophy that supports political democracy alongside a socially owned economy, with a particular emphasis on democratic management of enterprises and social and economic institutions. Unlike revolutionary socialists, democratic socialists advocate for a gradual, evolutionary path to socialism through established democratic processes, aiming to curb the excesses of capitalism through reform rather than outright abolition.',
  },
  {
    id: 'social-democrat',
    name: 'Social Democrat',
    description: 'A political ideology that supports economic and social interventions to promote social justice within the framework of a capitalist economy. It typically advocates for a mixed economy, a comprehensive welfare state providing universal services like healthcare and education, and robust collective bargaining rights. The goal is to create a more equitable and solidaristic society through reform and regulation, rather than abolishing capitalism.',
  },
  {
    id: 'progressive',
    name: 'Progressive',
    description: 'A political philosophy in support of social reform. It is based on the idea of progress in which advancements in science, technology, economic development, and social organization are vital to the improvement of the human condition. Progressives advocate for expanded government programs, social safety nets, environmental protection, and civil rights, often challenging traditional institutions and seeking to mitigate the negative effects of economic inequality and corporate power.',
  },
  {
    id: 'green-politics',
    name: 'Green Politics',
    description: 'A political ideology that aims to create an ecologically sustainable society. Its core principles are environmentalism, nonviolence, social justice, and grassroots democracy. Green politics is often seen as left-leaning, advocating for strong government regulation to protect the environment, promote renewable energy, and address climate change. It also emphasizes community-based economics and a departure from consumerism.',
  },
  {
    id: 'liberal',
    name: 'Liberal (Modern American)',
    description: 'A political and moral philosophy based on liberty, consent of the governed, and equality before the law. In the modern American context, it combines ideas of civil liberty and equality with support for social justice and a regulated market economy. It generally supports a strong role for government in reducing inequality, providing education, ensuring access to healthcare, and protecting the environment, while also upholding individual rights and freedoms.',
  },
  {
    id: 'social-liberal',
    name: 'Social Liberal',
    description: 'An ideology that combines liberal principles with a commitment to social justice. It believes that the state should intervene to ensure individual liberty and opportunity for everyone, which may require addressing economic and social inequalities. Social liberals support a regulated market economy and the expansion of civil and political rights, believing that a degree of social welfare is necessary for individuals to fully exercise their freedom.',
  },
  {
    id: 'centrist',
    name: 'Centrist',
    description: 'A political outlook or specific position that involves acceptance or support of a balance of a degree of social equality and a degree of social hierarchy, while opposing political changes which would result in a significant shift of society strongly to either the left or the right. It often takes pragmatic, evidence-based positions rather than being strictly ideological, valuing compromise and incremental change.',
  },
  {
    id: 'communitarian',
    name: 'Communitarian',
    description: 'A philosophy that emphasizes the connection between the individual and the community. Its core idea is that a person\'s social identity and personality are largely molded by community relationships, with a lesser degree of development being placed on individualism. It often critiques the perceived excesses of individualism and advocates for a renewed focus on community, shared values, and social responsibility.',
  },
  {
    id: 'third-way',
    name: 'Third Way',
    description: 'A political position akin to centrism that attempts to reconcile right-wing and left-wing politics by advocating a varying synthesis of center-right economic and center-left social policies. It supports a mixed economy, balancing free-market principles with social welfare programs, and often emphasizes opportunity, responsibility, and community as key values. It is seen as a pragmatic adaptation of social democracy to a globalized market.',
  },
  {
    id: 'neoliberal',
    name: 'Neoliberal',
    description: 'Characterized by policies of economic liberalization, including privatization, fiscal austerity, deregulation, free trade, and reductions in government spending in order to increase the role of the private sector in the economy and society. It is often associated with laissez-faire economics and is a modern resurgence of 19th-century ideas associated with economic liberalism.',
  },
  {
    id: 'classical-liberal',
    name: 'Classical Liberal',
    description: 'A political ideology that values the freedom of individuals — including freedom of religion, speech, press, assembly, and markets — as well as limited government. It draws on the economic ideas of Adam Smith and the political philosophies of John Locke, emphasizing free markets (laissez-faire), civil liberties under the rule of law, and a government limited in its scope and power.',
  },
  {
    id: 'libertarian',
    name: 'Libertarian',
    description: 'A political philosophy that upholds liberty as a core principle. Libertarians seek to maximize autonomy and political freedom, emphasizing free association, freedom of choice, individualism, and voluntary association. They advocate for a minimal state or even no state at all, believing that government intervention should be drastically limited in both economic and social matters.',
  },
  {
    id: 'anarcho-capitalist',
    name: 'Anarcho-Capitalist',
    description: 'A political philosophy that advocates for the elimination of the state in favor of a system of private property and free markets. In an anarcho-capitalist society, all services—including law enforcement, courts, and national defense—would be provided by voluntarily funded private companies. It represents the most extreme form of libertarianism, combining a belief in absolute individual sovereignty with a rejection of any form of government.',
  },
  {
    id: 'conservative',
    name: 'Conservative (Modern American)',
    description: 'A political and social philosophy that promotes retaining traditional social institutions. In the modern American context, it typically combines fiscal conservatism (low taxes, limited government spending) with social conservatism (traditional family values, established moral order) and a strong national defense. It emphasizes individual responsibility, limited government, and free enterprise.',
  },
  {
    id: 'christian-democrat',
    name: 'Christian Democrat',
    description: 'A political ideology that emerged in nineteenth-century Europe under the influence of Catholic social teaching. It synthesizes conservative social values with a commitment to social justice and a mixed economy. Christian Democrats often support a welfare state, social programs, and workers\' rights, while also upholding traditional family structures and cultural values. The ideology is characterized by its emphasis on community, solidarity, and subsidiarity.',
  },
  {
    id: 'fiscal-conservative',
    name: 'Fiscal Conservative',
    description: 'A political and economic philosophy regarding fiscal policy and fiscal responsibility with a belief in lower taxes, reduced government spending, and minimal government debt. Fiscal conservatives advocate for free markets, deregulation, and free trade. Their primary focus is on the economic aspects of conservatism, often prioritizing balanced budgets and limited government intervention in the economy.',
  },
  {
    id: 'social-conservative',
    name: 'Social Conservative',
    description: 'A political ideology that focuses on the preservation of what they see as traditional values and social mores. Social conservatives often support policies that reflect their moral and religious beliefs, such as opposition to abortion, same-sex marriage, and support for traditional family structures. They believe that traditional morality is a necessary foundation for a stable society.',
  },
  {
    id: 'theoconservative',
    name: 'Theoconservative',
    description: 'A political philosophy that seeks to apply religious principles to public policy. It is a form of social conservatism that is explicitly rooted in religious doctrine. Theoconservatives advocate for laws that reflect their interpretation of religious texts and morality, often on issues like family life, education, and bioethics. The ideology emphasizes the role of religion in providing a moral foundation for society and government.',
  },
  {
    id: 'paleoconservative',
    name: 'Paleoconservative',
    description: 'A political philosophy found primarily in the United States that stresses tradition, civil society, and anti-interventionism. Paleoconservatives are critical of the modern American conservative movement, which they see as having abandoned traditional principles. They often emphasize nationalism, skepticism of free trade, and a non-interventionist foreign policy, advocating for a return to what they view as the historical roots of American conservatism.',
  },
  {
    id: 'nationalist',
    name: 'Nationalist',
    description: 'An ideology that emphasizes loyalty, devotion, or allegiance to a nation or nation-state and holds that such obligations outweigh other individual or group interests. It prioritizes national interests, cultural unity, and the promotion of a single national identity above all else. Policies often focus on strengthening the nation-state, protecting its borders, and promoting its culture and values.',
  },
  {
    id: 'populist-right',
    name: 'Populist Right',
    description: 'A political ideology which combines right-wing politics with populist rhetoric and themes. The rhetoric often consists of anti-elitist sentiments, opposition to the Establishment, and speaking for the "common people". It often blends nationalism, social conservatism, and economic protectionism, framing political issues as a conflict between the ordinary citizen and a corrupt, out-of-touch elite.',
  },
  {
    id: 'authoritarian',
    name: 'Authoritarian',
    description: 'A form of government characterized by the rejection of political plurality, the use of strong central power to preserve the political status quo, and reductions in the rule of law, separation of powers, and democratic voting. It prioritizes order and control over individual freedoms, often suppressing political opposition and restricting civil liberties to maintain stability and enforce the will of the state or a single leader.',
  },
  {
    id: 'fascist',
    name: 'Fascist',
    description: 'A far-right, authoritarian, ultranationalist political ideology characterized by dictatorial power, forcible suppression of opposition, and strong regimentation of society and the economy. It exalts the nation and often race above the individual and stands for a centralized autocratic government headed by a dictatorial leader, severe economic and social regimentation, and forcible suppression of opposition.',
  },
  {
    id: 'totalitarian',
    name: 'Totalitarian',
    description: 'A concept for a form of government or political system that prohibits opposition parties, restricts individual opposition to the state and its claims, and exercises an extremely high degree of control over public and private life. It is regarded as the most extreme and complete form of authoritarianism, where the state seeks to control every aspect of individual life, from politics and the economy to personal beliefs and values.',
  },
];


export const NEWS_SOURCES: NewsSource[] = [
  { id: 'nbc-news', name: 'NBC News', rssUrl: 'http://feeds.nbcnews.com/nbcnews/public/news' },
  { id: 'yahoo-news', name: 'Yahoo! News', rssUrl: 'https://www.yahoo.com/news/rss' },
  { id: 'cnbc', name: 'CNBC', rssUrl: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
  { id: 'cbs-news', name: 'CBS News', rssUrl: 'https://www.cbsnews.com/latest/rss/main' },
  { id: 'bbc-news', name: 'BBC News', rssUrl: 'https://feeds.bbci.co.uk/news/rss.xml' },
  { id: 'espn', name: 'ESPN', rssUrl: 'https://www.espn.com/espn/rss/news' },
  { id: 'npr', name: 'NPR', rssUrl: 'https://feeds.npr.org/1001/rss.xml' },
  { id: 'nytimes', name: 'NYTimes.com', rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml' },
  { id: 'forbes', name: 'Forbes', rssUrl: 'https://www.forbes.com/real-time/feed2/' },
  { id: 'cnn', name: 'CNN', rssUrl: 'http://rss.cnn.com/rss/cnn_topstories.rss' },
  { id: 'tmz', name: 'TMZ', rssUrl: 'https://www.tmz.com/rss.xml' },
  { id: 'buzzfeed', name: 'Buzzfeed', rssUrl: 'https://www.buzzfeed.com/index.xml' },
  { id: 'fox-news', name: 'Fox News', rssUrl: 'https://moxie.foxnews.com/google-publisher/latest.xml' },
  { id: 'politico', name: 'POLITICO', rssUrl: 'https://www.politico.com/rss/politicopicks.xml' },
  { id: 'guardian', name: 'The Guardian', rssUrl: 'https://www.theguardian.com/world/rss' },
  { id: 'wapo', name: 'The Washington Post', rssUrl: 'https://feeds.washingtonpost.com/rss/world' },
];