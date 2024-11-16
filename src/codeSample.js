export default `quote

# this is a line comment
"this is a string"
\`this is a command\`

"""
String interpolations: x=$x, y=$(y)"
Escape sequences: \\u2615, \\n
"""

raw"""
No interpolations x=$(x),
No escape sequences except \\\\ and \\"
"""

\`echo command interpolations: $[1, 2, 3]\`
foo\`echo no interpolation $[1, 2, 3]\`

'A'
'\\u2615'

123 + 456_789 + 0.123 + 0b1010 + 0x0C0FFEE + 0x1.p-10 +ₙ 2π
true || false

variable
:symbol
obj.field
xs[2:end]

(where where where) === Any
:(x!=y) != :(x! = y)

x'x
5u"kg" + p[]g(x)

Mod.@metaMcMacroFace x, y = 1, 2

function f(x)
    if x isa Foo
        foo!(x; kwarg=:bar)
    else
        baz!(x)
    end
end


@wasm module Bar
  function f(b::Int32)
    if b
      1
    else
      -1
    end
  end
end

html"""
  <!DOCTYPE html>
  <h1>Title</h1>
  <!-- comment -->
  <div attr=value>foo bar</div>

  <style>
    /* comment */
    selector {
      bg: color(rgb 0 0 0);
      font-size: 12pt;
    }
    :root {
       --main-bg-color: whitesmoke;
    }
    body {
       background-color: var(--main-bg-color);
    }
  </style>

  <script>
    /* comment */
    let lang = "JavaScript";
    console.log(\`Greetings from \${lang}\`)
  </script>
"""

end;`
