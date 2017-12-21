import { OrgdupPage } from './app.po';

describe('orgdup App', () => {
  let page: OrgdupPage;

  beforeEach(() => {
    page = new OrgdupPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
