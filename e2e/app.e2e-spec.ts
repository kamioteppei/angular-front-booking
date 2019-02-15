import { AngularFrontBookingPage } from './app.po';

describe('angular-front-booking App', () => {
  let page: AngularFrontBookingPage;

  beforeEach(() => {
    page = new AngularFrontBookingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
