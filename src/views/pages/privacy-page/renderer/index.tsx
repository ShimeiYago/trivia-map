import React from 'react';
import { Typography } from '@mui/material';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { DesignedHead } from 'views/components/atoms/designed-head';
import { PAGE_NAMES } from 'constant/page-names';
import { SITE_NAME } from 'constant';

export class Renderer extends React.Component {
  render() {
    return (
      <ArticleWrapper>
        <Typography component="h2" variant="h4" mb={3}>
          {PAGE_NAMES.privacy}
        </Typography>
        {renderHead('個人情報の利用目的')}
        <Typography sx={{ mb: 1 }}>
          {SITE_NAME}
          （以下当ブログ）では、アカウント登録、お問い合わせなどの際に、名前（ハンドルネーム）、メールアドレス等の個人情報をご登録いただく場合がございます。
        </Typography>
        <Typography sx={{ mb: 3 }}>
          これらの個人情報は、各投稿にお名前を表示する場合や、必要な情報を電子メールなどでご連絡する場合に利用させていただくものであり、個人情報をご提供いただく際の目的以外では利用いたしません。
        </Typography>
        {renderHead('個人情報の第三者への開示')}
        <Typography sx={{ mb: 1 }}>
          当サイトでは、個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。
        </Typography>
        <ul>
          <li>本人のご了解がある場合</li>
          <li>法令等への協力のため、開示が必要となる場合</li>
        </ul>
        <Typography sx={{ mb: 3 }}>
          また、ご本人からの個人データの開示、訂正、追加、削除、利用停止のご希望の場合には、ご本人であることを確認させていただいた上、速やかに対応させていただきます。
        </Typography>

        {renderHead('Cookieの使用について')}
        <Typography sx={{ mb: 1 }}>
          （当ブログでは、広告配信やアクセス解析のためにCookieを使用しています。
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Cookieによりブラウザを識別していますが、特定の個人の識別はできない状態で匿名性が保たれています。
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Cookieの使用を望まない場合、ブラウザからCookieを無効に設定できます。
        </Typography>
        {renderHead('広告の配信について')}
        <Typography sx={{ mb: 3 }}>
          当サイトはGoogle及びGoogleのパートナー（第三者配信事業者）の提供する広告を設置しております。その広告配信にはCookieを使用し、当サイトやその他のサイトへの過去のアクセス情報に基づいて広告を配信します。
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Googleが広告Cookieを使用することにより、当サイトや他のサイトにアクセスした際の情報に基づいて、Googleやそのパートナーが適切な広告を表示しています。
        </Typography>
        <Typography sx={{ mb: 3 }}>
          お客様はGoogleアカウントの広告設定ページ（
          <a href="https://adssettings.google.com/u/0/authenticated">
            https://adssettings.google.com/u/0/authenticated
          </a>
          ）で、パーソナライズ広告を無効にできます。また
          <a href="www.aboutads.info">www.aboutads.info</a>
          のページにアクセスして頂き、パーソナライズ広告掲載に使用される第三者配信事業者のCookieを無効にできます。
        </Typography>
        {renderHead('アクセス解析ツールについて')}
        <Typography sx={{ mb: 1 }}>
          当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。
        </Typography>
        <Typography sx={{ mb: 3 }}>
          このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関して、詳しくは
          <a href="https://marketingplatform.google.com/about/analytics/terms/jp/">こちら</a>
          をご覧ください。
        </Typography>
        {renderHead('当サイトへの投稿・コメントについて')}
        <Typography sx={{ mb: 1 }}>
          当サイトでは、スパム・荒らしへの対応として、投稿・コメントの際に使用されたIPアドレスを記録しています。
        </Typography>
        <Typography sx={{ mb: 3 }}>
          これはシステムの標準機能としてサポートされている機能で、スパム・荒らしへの対応以外にこのIPアドレスを使用することはありません。
        </Typography>
        {renderHead('著作権について')}
        <Typography sx={{ mb: 1 }}>
          当サイトで掲載している画像の著作権・肖像権等は各権利所有者に帰属致します。権利を侵害する目的ではございません。記事の内容や掲載画像等に問題がございましたら、各権利所有者様本人が直接メールでご連絡下さい。確認後、対応させて頂きます。
        </Typography>
        <Typography sx={{ mb: 1 }}>
          当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。
        </Typography>
        <Typography sx={{ mb: 1 }}>
          当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。
        </Typography>
        <Typography sx={{ mb: 3 }}>
          当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
        </Typography>
        {renderHead('免責事項')}
        <Typography sx={{ mb: 1 }}>
          当サイトの記事について、著作権は放棄しておりません。当サイトに存在する、文章・画像・動画等の著作物の情報を無断転載することを禁止します。引用の範囲を超えるものについては、法的処置を行います。転載を希望される方は、ご連絡をお願いします。
        </Typography>
        <Typography sx={{ mb: 3 }}>
          当サイトは著作権の侵害を目的とするものではありません。使用している版権物の知的所有権はそれぞれの著作者・団体に帰属しております。著作権や肖像権に関して問題がありましたら御連絡下さい。著作権所有者様からの警告及び修正・撤去のご連絡があった場合は迅速に対処または削除致します。
        </Typography>
        {renderHead('制定日・最終改定日')}
        <Typography sx={{ mb: 1 }}>制定日：2023年3月1日</Typography>
        <Typography sx={{ mb: 3 }}>最終改定日：2023年3月1日</Typography>
      </ArticleWrapper>
    );
  }
}

function renderHead(text: string) {
  return (
    <DesignedHead variant="h5" component="h3">
      {text}
    </DesignedHead>
  );
}
