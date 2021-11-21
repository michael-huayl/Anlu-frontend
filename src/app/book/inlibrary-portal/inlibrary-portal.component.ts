import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { TokenStorageService } from 'src/app/auth/token-storage.service';
import { Book, BookWish, CreateWishDto, SearchBookDto } from 'src/app/common/book-dto';
import { CommonService } from 'src/app/common/common.service';
import { BookService } from '../book.service';

@Component({
  selector: 'app-inlibrary-portal',
  templateUrl: './inlibrary-portal.component.html',
  styleUrls: ['./inlibrary-portal.component.css']
})
export class InlibraryPortalComponent implements OnInit, AfterViewInit, OnDestroy {

  hardBookList: Book[];
  role: string = 'reader';
  listName = 'catBook';
  listBlock: boolean = true;
  readerName: string;

  constructor(
    private logger: NGXLogger,
    private fb: FormBuilder,
    private bookService: BookService,
    private tokenService: TokenStorageService,
    private commonService: CommonService,
    private datePipe: DatePipe,
    public translate: TranslateService,
  ) { }

  searchForm = this.fb.group({
    format: ['Hardcopy'],
    category: [''],
    bookTitle: [''],
    author: [''],
    publishYear: [''],
  })

  wishForm = this.fb.group({
    bookTitle: [''],
    language: [''],
    format: [''],
    creator: [''],
  })

  ngOnInit(): void {
    this.readerName = this.tokenService.getUsername();
    this.commonService.setSubject(this.readerName);
    this.wishForm.setValue({
      bookTitle: '',
      language: 'English',
      format: 'Hardcopy',
      creator: this.readerName,
    })
    const allLink = document.getElementById('allLink') as HTMLButtonElement;
    allLink.click();
  }

  ngAfterViewInit() {
    const navHbook = document.getElementById('nav-inLibrary');
    const navHome = document.getElementById('nav-myLibrary')
    if (!navHbook.className.includes('active')) {
      navHbook.className += ' active';
      navHome.className = navHome.className.slice(0, -7);
    }
  }

  setBookList(categoryInput: string) {
    if (categoryInput === 'All') {
      this.bookService.findAllBook('Hardcopy').subscribe((data: []) => {
        if (data && data.length > 0) {
          this.hardBookList = data;
          this.logger.info('Succes load all hardcopy Book list');
        } else if (data && data.length == 0) {
          this.hardBookList = [];
          this.logger.info('No hardcopy in database');
        } else {
          this.logger.warn('Some abnormal happened in backend server');
        }
      });
    } else {
      const searchDto = {
        format: 'Hardcopy',
        category: categoryInput,
        bookTitle: '',
        author: '',
        publishYear: '',
      }
      this.bookService.findBookList(searchDto).subscribe((data) => {
        if (data && data.length > 0) {
          this.hardBookList = data;
          this.logger.info('Success got inLibrary book list from server');
        } else if (data && data.length == 0) {
          this.hardBookList = [];
          this.logger.info(`Can not find any inLibrary book within ${categoryInput}`);
        } else {
          this.logger.warn('Some abnormal happened in backend server');
        }
      });
    }
  }

  searchBookList() {
    const searchInfo: SearchBookDto = this.searchForm.value;
    if (searchInfo.category !== '' || searchInfo.author !== '' || searchInfo.bookTitle !== '' || searchInfo.publishYear !== '') {
      this.bookService.findBookList(searchInfo).subscribe((data) => {
        if (data && data.length > 0) {
          this.hardBookList = data;
          this.logger.info('Success got inLibrary book list from server');
        } else if (data && data.length == 0) {
          this.hardBookList = [];
          this.logger.info(`Can not find any inLibrary book with search conditions`);
        } else {
          this.logger.warn('Some abnormal happened in backend server');
        }
      });
    } else {
      let notice1: string;
      this.translate.stream('inlibraryPortal.notice-1').subscribe((res) => {
        notice1 = res;
      });
      window.alert(notice1);
      this.logger.warn('No search input, did not trigger search yet');
    }
  }

  clickHome() {
    if (this.listName !== 'catBook') this.listName = 'catBook';
    const allLink = document.getElementById('allLink') as HTMLButtonElement;
    allLink.click();
    if (!this.listBlock) this.listBlock = true;
  }

  clickSearch() {
    if (this.listName !== 'searchBook') this.listName = 'searchBook';
    const searchInfo: SearchBookDto = this.searchForm.value;
    if (searchInfo.category == '' && searchInfo.author == '' && searchInfo.bookTitle == '' && searchInfo.publishYear == '') {
      this.hardBookList = [];
    } else {
      const searchButton = document.querySelector('button.book-search') as HTMLButtonElement;
      searchButton.click();
    }
    if (!this.listBlock) this.listBlock = true;
  }

  clickWish() {
    if (this.listBlock) this.listBlock = false;
    this.updateWishList();
  }

  updateWishList() {
    const wishListDiv = document.querySelector('div.wish-list');
    const getWishListDto = { format: 'Hardcopy', readerName: this.readerName }
    //Delete all ild wishes in list
    while (wishListDiv.firstChild) {
      wishListDiv.removeChild(wishListDiv.firstChild);
    }
    //Add wishlist based on server data
    this.bookService.getWishList(getWishListDto).subscribe((wishList: BookWish[]) => {
      if (wishList && wishList.length > 0) {
        for (const item of wishList) {
          const div1 = document.createElement('div');
          div1.className = 'col-md-2';
          wishListDiv.appendChild(div1);
          const p1 = document.createElement('p');
          const createTime = this.datePipe.transform(item.createTime, 'short');
          p1.innerHTML = createTime;
          div1.appendChild(p1);
          const div2 = document.createElement('div');
          div2.className = 'col-md-2';
          wishListDiv.appendChild(div2);
          const p2 = document.createElement('p');
          p2.innerHTML = item.bookTitle;
          div2.appendChild(p2);
          const div3 = document.createElement('div');
          div3.className = 'col-md-2';
          wishListDiv.appendChild(div3);
          const p3 = document.createElement('p');
          p3.innerHTML = item.language;
          div3.appendChild(p3);
          const div4 = document.createElement('div');
          div4.className = 'col-md-2';
          wishListDiv.appendChild(div4);
          const p4 = document.createElement('p');
          p4.innerHTML = item.status;
          div4.appendChild(p4);
          const div5 = document.createElement('div');
          div5.className = 'col-md-4 text-center';
          wishListDiv.appendChild(div5);
          const delBut = document.createElement('button');
          delBut.className = 'del-wish btn btn-link';
          this.translate.stream('inlibraryPortal.delLink').subscribe((res) => {
            delBut.innerHTML = res;
          });
          delBut.style.marginTop = '-10px';
          delBut.addEventListener('click', this.delWish.bind(this, item._id));
          div5.appendChild(delBut);
        }
      } else if (wishList && wishList.length === 0) {
        const emptyMessage = document.createElement('p');
        this.translate.stream('inlibraryPortal.notice-2').subscribe((res) => {
          emptyMessage.innerHTML = res;
        });
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.fontSize = 'x-large';
        emptyMessage.style.color = 'gray';
        emptyMessage.style.marginTop = '50px';
        wishListDiv.appendChild(emptyMessage);
      }
    })
  }

  createWish() {
    const wishVal: CreateWishDto = this.wishForm.value;
    if (wishVal.bookTitle !== '') {
      const searchDto = {
        format: 'Hardcopy',
        category: '',
        bookTitle: wishVal.bookTitle.trim(),
        author: '',
        publishYear: '',
      }
      this.bookService.findBookList(searchDto).subscribe((bookList: Book[]) => {
        if (bookList && bookList.length > 0) {
          this.translate
            .stream('inlibraryPortal.notice-3', {
              bookTitle: wishVal.bookTitle,
              category: bookList[0].category,
            })
            .subscribe((res) => {
              window.alert(res);
            });
        } else if (bookList && bookList.length == 0) {
          this.bookService.createWish(wishVal).subscribe((wish: BookWish) => {
            if (wish && wish.bookTitle) {
              this.logger.info('Success created wish');
              this.updateWishList();
            }
          })
        }
      })
    }
  }

  delWish(wishID: string) {
    let notice: string;
    this.translate.stream('inlibraryPortal.notice-4').subscribe((res) => {
      notice = res;
    });
    if (window.confirm(notice)) {
      this.bookService.delWish(wishID).subscribe((id) => {
        if (id == wishID) {
          this.logger.info('Success delete the wish');
          this.updateWishList();
        }
      })
    }
  }

  ngOnDestroy() {
    const delLinks = document.querySelectorAll('button.del-wish');
    if (delLinks && delLinks.length > 0) {
      for (let i = 0; i < delLinks.length; i++) {
        delLinks[i].replaceWith(delLinks[i].cloneNode(true));
      }
    }
    this.logger.info('Success cleaned all added eventListeners');
  }
}
