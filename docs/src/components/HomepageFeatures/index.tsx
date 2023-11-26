import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  img: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    img: 'img/code.png',
    description: (
      <>
        This package is very simple to use.
        <br />
        You don't need to find assets by id.
      </>
    ),
  },
  {
    title: 'Auto Complete Your Code',
    img: 'img/autocomplete.png',
    description: (
      <>
        Auto-completion will help you code in
        intelligent editors such as VSCode.
      </>
    ),
  },
  {
    title: 'Get List of Genshin Objects',
    img: 'img/datalist.png',
    description: (
      <>
        You get a list of characters, weapons, etc. as well as player profiles!
        This includes detailed skill data and weapon capabilities.
      </>
    ),
  },
];

function Feature({ title, img, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={img} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
