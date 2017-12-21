import { DshbPage } from './app.po';

describe('dshb App', () => {
  let page: DshbPage;

  beforeEach(() => {
    page = new DshbPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
