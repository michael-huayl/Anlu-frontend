import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ActivatedRoute } from '@angular/router';

import { BookService } from '../book.service';
import { Book } from 'src/app/common/book-dto';

@Component({
  selector: 'app-audiobook-play',
  templateUrl: './audiobook-play.component.html',
  styleUrls: ['./audiobook-play.component.css']
})
export class AudiobookPlayComponent implements OnInit {
  audioBook: Book;

  constructor(
    private logger: NGXLogger,
    private route: ActivatedRoute,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    const bookID = this.route.snapshot.paramMap.get('id');
    const currentTime = Number(this.route.snapshot.paramMap.get('time'));
    this.bookService.getBook(bookID).subscribe((data: Book) => {
      if (data && data.format==='Audiobook') {
        this.audioBook = data;
        this.audioBook.coverPic = this.audioBook.coverPic.slice(2,);
        this.audioBook.bookFile = this.audioBook.bookFile.slice(2,);
        //const bookAudio = document.getElementById('book-audio') as HTMLAudioElement;
        //bookAudio.currentTime = currentTime;
      } else {
        this.logger.warn(`Server can not find Audiobook ${bookID}`);
      }
    });
  }

}
