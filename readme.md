```css
@media (--from-mobile) and (--until-tablet) {
	color: blue;
	size: 10px; /* this instead of height + width */
}
```

```svelte
<Overlay mobile="/mobile.jpg@393" desktop="/desktop.jpg@1920" />
```
