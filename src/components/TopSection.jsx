import notificationIcon from '../../public/bell.svg';
import filterIcon from '../../public/filter-icon.svg';
import searchIcon from '../../public/search-icon.svg';
import logoText from '../../public/logo.svg';
import sty from './TopSection.module.css';

export default function TopSection() {
  return (
    <div className='absolute h-[53px]' id='absolute_shrink0_h53px'>
      <div className='absolute h-[3px] top-[117px]' id='absolute_w1512px_h3px'>
        <div className='absolute h-[53px] left-[433px]' id='topsection_1'>
          <div className='relative h-[53px]' id='topsection_2'>
            <div className='absolute h-[53px]' id='topsection_3'>
              <div className='relative h-[53px]' id='topsection_4'>
                <div
                  className={`${sty.notification} shadow-effect`}
                  id='notifications'
                >
                  <img
                    className='relative top-2 left-[9px]'
                    id='bell'
                    src={notificationIcon}
                    alt='bell'
                  />
                </div>

                <div className={sty.addListing} id='add_listing'>
                  <div>Add Listing</div>
                </div>

                <div
                  className='absolute w-[595px] h-[53px]'
                  id='filter_search_bar'
                >
                  <img
                    className='absolute top-1 left-[34rem]'
                    id='filter'
                    src={filterIcon}
                    alt='filter'
                  />

                  <img
                    className='absolute h-11 top-1 left-[491px]'
                    id='search_icon'
                    src={searchIcon}
                    alt='search'
                  />

                  <div
                    className={`${sty.searchBar} shadow-effect`}
                    id='search_bar'
                  >
                    <div className='relative flex flex-row' id='sub_headers'>
                      <div
                        className={`${sty.subHeader} left-8`}
                        id='where_sub_header'
                      >
                        Where?
                      </div>
                      <div
                        className={`${sty.subHeader} left-36`}
                        id='search_sub_header'
                      >
                        Search
                      </div>
                    </div>

                    <div
                      className='relative flex flex-row top-4'
                      id='descriptions'
                    >
                      <div
                        className={`${sty.description} left-0.5`}
                        id='where_description'
                      >
                        Search Location
                      </div>
                      <div
                        className={`${sty.description} left-[66px]`}
                        id='search_description'
                      >
                        What are you looking for?
                      </div>
                    </div>
                  </div>

                  <div
                    className='absolute w-px h-[35px] top-2 left-[198px]'
                    id='divider'
                  >
                    <svg width='1' height='35' viewBox='0 0 1 35' fill='none'>
                      <line
                        x1='0.5'
                        y1='0.5'
                        x2='0.499998'
                        y2='34.5'
                        stroke='#71767C'
                        strokeLinecap='round'
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <img
          className='absolute w-[101px] h-[37px]'
          id='logo_text'
          src={logoText}
          alt='logo'
        />
      </div>
    </div>
  );
}
