import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';

import { TokenStorageService } from 'src/app/auth/token-storage.service';
import { CommonService } from 'src/app/common/common.service';
import { Book, SearchBookDto } from '../../common/book-dto';
import { BookService } from '../book.service';

@Component({
  selector: 'app-ebook-portal',
  templateUrl: './ebook-portal.component.html',
  styleUrls: ['./ebook-portal.component.css']
})
export class EbookPortalComponent implements OnInit, AfterViewInit {

  ebookList: Book[];
  role: string = 'reader';
  listName = 'catBook';

  constructor(
    private logger: NGXLogger,
    private fb: FormBuilder,
    private bookService: BookService,
    private tokenService: TokenStorageService,
    private commonService: CommonService,
  ) { }

  searchForm = this.fb.group({
    format: ['eBook'],
    category: [''],
    bookTitle: [''],
    author: [''],
    publishYear: [''],
  })

  ngOnInit(): void {
    this.commonService.setSubject(this.tokenService.getUsername());
    const allLink = document.getElementById('allLink') as HTMLButtonElement;
    allLink.click();
  }

  ngAfterViewInit() {
    const navEbook = document.getElementById('nav-ebook');
    const navHome = document.getElementById('nav-myLibrary')
    if (!navEbook.className.includes('active')) {
      navEbook.className += ' active';
      navHome.className = navHome.className.slice(0,-7);
    }
  }

  setBookList(categoryInput: string) {
    if (categoryInput === 'All') {
      this.bookService.findAllBook('eBook').subscribe((data: []) => {
        if (data && data.length > 0) {
          this.ebookList = data;
          this.logger.info('Succes load all eBook list');
        } else if (data && data.length == 0) {
          this.ebookList = [];
          this.logger.info('No eBook in database');
        } else {
          this.logger.warn('Some abnormal happened in backend server');
        }
      });
    } else {
      const searchDto = {
        format: 'eBook',
        category: categoryInput,
        bookTitle: '',
        author: '',
        publishYear: '',
      }
      this.bookService.findBookList(searchDto).subscribe((data) => {
        if (data && data.length > 0) {
          this.ebookList = data;
          this.logger.info('Success got eBook list from server');
        } else if (data && data.length == 0) {
          this.ebookList = [];
          this.logger.info(`Can not find any eBook within ${categoryInput}`);
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
          this.ebookList = data;
          this.logger.info('Success got eBook list from server');
        } else if (data && data.length == 0) {
          this.ebookList = [];
          this.logger.info(`Can not find any eBook with search conditions`);
        } else {
          this.logger.warn('Some abnormal happened in backend server');
        }
      });
    } else {
      window.alert('No search input, please input your search conditions');
      this.logger.warn('No search input, did not trigger search yet');
    }
  }

  clickHome() {
    if (this.listName!=='catBook') this.listName = 'catBook';
    const allLink = document.getElementById('allLink') as HTMLButtonElement;
    allLink.click();
  }

  clickSearch() {
    if (this.listName!=='searchBook') this.listName = 'searchBook';
    const searchInfo: SearchBookDto = this.searchForm.value;
    if (searchInfo.category == '' && searchInfo.author == '' && searchInfo.bookTitle == '' && searchInfo.publishYear == '') {
      this.ebookList = [];
    } else {
      const searchButton = document.querySelector('button.book-search') as HTMLButtonElement;
      searchButton.click();
    }
  }
}
